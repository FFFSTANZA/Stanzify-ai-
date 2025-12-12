// Slidev Runtime Service - Manages slidev servers, builds, and exports
export interface SlidevRuntimeConfig {
  port?: number;
  host?: string;
  open?: boolean;
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
  theme?: string;
  fonts?: string[];
  download?: boolean;
  remote?: boolean;
  presenter?: boolean;
}

export interface SlidevExportOptions {
  format: 'pdf' | 'png' | 'svg' | 'html' | 'pptx';
  timeout?: number;
  dark?: boolean;
  withToc?: boolean;
  withClicks?: boolean;
  output?: string;
  width?: number;
  height?: number;
}

export interface SlidevBuildOptions {
  outDir?: string;
  base?: string;
  download?: boolean;
  withToc?: boolean;
  expose?: boolean;
  theme?: string;
}

// Active slidev process management
let activeProcesses: Map<string, {
  process: any;
  port: number;
  startTime: number;
  url: string;
}> = new Map();

export class SlidevRuntimeService {
  private static instance: SlidevRuntimeService;

  public static getInstance(): SlidevRuntimeService {
    if (!SlidevRuntimeService.instance) {
      SlidevRuntimeService.instance = new SlidevRuntimeService();
    }
    return SlidevRuntimeService.instance;
  }

  /**
   * Start a slidev development server
   */
  async startDevServer(
    markdownFile: string,
    config: SlidevRuntimeConfig = {}
  ): Promise<{
    success: boolean;
    url?: string;
    port?: number;
    error?: string;
    processId: string;
  }> {
    const {
      port = 3030,
      host = 'localhost',
      open = false,
      logLevel = 'info',
      theme = 'default',
      download = true,
      remote = true,
      presenter = true
    } = config;

    const processId = `slidev-${port}-${Date.now()}`;

    try {
      // Check if port is already in use
      if (this.isPortInUse(port)) {
        return {
          success: false,
          error: `Port ${port} is already in use`,
          processId
        };
      }

      // Validate markdown file exists
      const fs = await import('fs/promises');
      try {
        await fs.access(markdownFile);
      } catch {
        return {
          success: false,
          error: `Markdown file not found: ${markdownFile}`,
          processId
        };
      }

      // Build slidev command
      const command = this.buildSlidevCommand({
        file: markdownFile,
        port,
        host,
        open,
        logLevel,
        theme,
        download,
        remote,
        presenter
      });

      // Start the process
      const { spawn } = await import('child_process');
      const process = spawn(command.executable, command.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '0' }
      });

      let serverReady = false;
      let startupError = '';

      process.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log(`[Slidev ${port}] ${output}`);
        
        if (output.includes('Local:') || output.includes('Network:')) {
          serverReady = true;
        }
      });

      process.stderr?.on('data', (data) => {
        const error = data.toString();
        console.error(`[Slidev ${port}] Error: ${error}`);
        
        if (error.includes('EADDRINUSE') || error.includes('error')) {
          startupError = error;
        }
      });

      process.on('close', (code) => {
        console.log(`[Slidev ${port}] Process exited with code ${code}`);
        activeProcesses.delete(processId);
      });

      // Wait for server to be ready (max 10 seconds)
      const maxWaitTime = 10000;
      const waitStart = Date.now();
      
      while (!serverReady && (Date.now() - waitStart) < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (startupError) {
          return {
            success: false,
            error: startupError,
            processId
          };
        }
      }

      if (!serverReady) {
        process.kill();
        return {
          success: false,
          error: 'Server failed to start within timeout period',
          processId
        };
      }

      const url = `http://${host}:${port}`;
      
      // Store active process
      activeProcesses.set(processId, {
        process,
        port,
        startTime: Date.now(),
        url
      });

      console.log(`[Slidev Runtime] Server started successfully: ${url}`);
      
      return {
        success: true,
        url,
        port,
        processId
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processId
      };
    }
  }

  /**
   * Export presentation to various formats
   */
  async exportPresentation(
    markdownFile: string,
    options: SlidevExportOptions
  ): Promise<{
    success: boolean;
    outputPath?: string;
    error?: string;
  }> {
    const {
      format,
      timeout = 30000,
      dark = false,
      withToc = false,
      withClicks = false,
      output,
      width = 1920,
      height = 1080
    } = options;

    try {
      const command = this.buildExportCommand({
        file: markdownFile,
        format,
        timeout,
        dark,
        withToc,
        withClicks,
        output,
        width,
        height
      });

      const { spawn } = await import('child_process');
      
      return new Promise((resolve) => {
        const process = spawn(command.executable, command.args, {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout?.on('data', (data) => {
          stdout += data.toString();
          console.log(`[Slidev Export] ${data.toString()}`);
        });

        process.stderr?.on('data', (data) => {
          stderr += data.toString();
          console.error(`[Slidev Export] Error: ${data.toString()}`);
        });

        process.on('close', (code) => {
          if (code === 0) {
            // Try to find output file path
            const outputPath = this.extractOutputPath(stdout, format);
            resolve({
              success: true,
              outputPath
            });
          } else {
            resolve({
              success: false,
              error: stderr || `Export failed with exit code ${code}`
            });
          }
        });

        // Timeout
        setTimeout(() => {
          process.kill();
          resolve({
            success: false,
            error: 'Export timeout'
          });
        }, timeout);
      });

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Build presentation for production
   */
  async buildPresentation(
    markdownFile: string,
    options: SlidevBuildOptions = {}
  ): Promise<{
    success: boolean;
    outputDir?: string;
    error?: string;
  }> {
    const {
      outDir = 'dist',
      base = '/',
      download = true,
      withToc = false,
      expose = false,
      theme = 'default'
    } = options;

    try {
      const command = this.buildBuildCommand({
        file: markdownFile,
        outDir,
        base,
        download,
        withToc,
        expose,
        theme
      });

      const { spawn } = await import('child_process');
      
      return new Promise((resolve) => {
        const process = spawn(command.executable, command.args, {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        process.stdout?.on('data', (data) => {
          console.log(`[Slidev Build] ${data.toString()}`);
        });

        process.stderr?.on('data', (data) => {
          console.error(`[Slidev Build] Error: ${data.toString()}`);
        });

        process.on('close', (code) => {
          if (code === 0) {
            resolve({
              success: true,
              outputDir: outDir
            });
          } else {
            resolve({
              success: false,
              error: `Build failed with exit code ${code}`
            });
          }
        });
      });

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Stop a running slidev server
   */
  stopServer(processId: string): {
    success: boolean;
    error?: string;
  } {
    const processInfo = activeProcesses.get(processId);
    
    if (!processInfo) {
      return {
        success: false,
        error: `Process ${processId} not found`
      };
    }

    try {
      processInfo.process.kill();
      activeProcesses.delete(processId);
      
      console.log(`[Slidev Runtime] Server stopped: ${processInfo.url}`);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to stop server'
      };
    }
  }

  /**
   * Stop all running slidev servers
   */
  stopAllServers(): {
    stopped: number;
    errors: string[];
  } {
    let stopped = 0;
    const errors: string[] = [];

    activeProcesses.forEach((processInfo, processId) => {
      try {
        processInfo.process.kill();
        stopped++;
      } catch (error) {
        errors.push(`Failed to stop ${processId}: ${error}`);
      }
    });

    activeProcesses.clear();
    
    return { stopped, errors };
  }

  /**
   * Get status of all active servers
   */
  getActiveServers(): Array<{
    processId: string;
    url: string;
    port: number;
    uptime: number;
  }> {
    const now = Date.now();
    
    return Array.from(activeProcesses.entries()).map(([processId, info]) => ({
      processId,
      url: info.url,
      port: info.port,
      uptime: now - info.startTime
    }));
  }

  /**
   * Health check for slidev installation
   */
  async checkInstallation(): Promise<{
    installed: boolean;
    version?: string;
    error?: string;
  }> {
    try {
      const { spawn } = await import('child_process');
      
      return new Promise((resolve) => {
        const process = spawn('npx', ['@slidev/cli@latest', '--version'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let version = '';
        let error = '';

        process.stdout?.on('data', (data) => {
          version += data.toString();
        });

        process.stderr?.on('data', (data) => {
          error += data.toString();
        });

        process.on('close', (code) => {
          if (code === 0) {
            resolve({
              installed: true,
              version: version.trim()
            });
          } else {
            resolve({
              installed: false,
              error: error || 'Unknown error'
            });
          }
        });
      });

    } catch (error) {
      return {
        installed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Private helper methods
  private buildSlidevCommand(config: any): { executable: string; args: string[] } {
    const args = ['@slidev/cli@latest'];

    if (config.file) args.push(config.file);
    if (config.port) args.push('--port', config.port.toString());
    if (config.host) args.push('--host', config.host);
    if (config.open) args.push('--open');
    if (config.logLevel) args.push('--log-level', config.logLevel);
    if (config.theme) args.push('--theme', config.theme);
    if (config.download) args.push('--download');
    if (config.remote) args.push('--remote');
    if (config.presenter) args.push('--presenter');

    return {
      executable: 'npx',
      args
    };
  }

  private buildExportCommand(config: any): { executable: string; args: string[] } {
    const args = ['@slidev/cli@latest', 'export'];

    if (config.file) args.push(config.file);
    if (config.format) args.push('--format', config.format);
    if (config.timeout) args.push('--timeout', config.timeout.toString());
    if (config.dark) args.push('--dark');
    if (config.withToc) args.push('--with-toc');
    if (config.withClicks) args.push('--with-clicks');
    if (config.output) args.push('--output', config.output);
    if (config.width) args.push('--width', config.width.toString());
    if (config.height) args.push('--height', config.height.toString());

    return {
      executable: 'npx',
      args
    };
  }

  private buildBuildCommand(config: any): { executable: string; args: string[] } {
    const args = ['@slidev/cli@latest', 'build'];

    if (config.file) args.push(config.file);
    if (config.outDir) args.push('--out', config.outDir);
    if (config.base) args.push('--base', config.base);
    if (config.download) args.push('--download');
    if (config.withToc) args.push('--with-toc');
    if (config.expose) args.push('--expose');
    if (config.theme) args.push('--theme', config.theme);

    return {
      executable: 'npx',
      args
    };
  }

  private isPortInUse(port: number): boolean {
    // This is a simplified check - in a real implementation,
    // you might want to use a more robust port checking method
    return Array.from(activeProcesses.values()).some(info => info.port === port);
  }

  private extractOutputPath(stdout: string, format: string): string | undefined {
    const patterns = [
      new RegExp(`exported to (.+)\\.${format}`, 'i'),
      new RegExp(`output: (.+)\\.${format}`, 'i'),
      new RegExp(`saved to (.+)\\.${format}`, 'i')
    ];

    for (const pattern of patterns) {
      const match = stdout.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return undefined;
  }
}

// Export singleton instance
export const slidevRuntime = SlidevRuntimeService.getInstance();
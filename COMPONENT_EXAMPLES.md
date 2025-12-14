# Component System Examples

## Example Component-Based Presentation JSON

Here's a complete example of a component-based presentation structure that the AI generates:

```json
{
  "title": "AI-Powered Product Launch",
  "subtitle": "Introducing the Future of Automation",
  "theme": "modern",
  "slides": [
    {
      "id": "slide-1",
      "componentId": "hero",
      "props": {
        "title": "Welcome to the Future",
        "subtitle": "AI-Powered Automation Platform",
        "description": "Transform your workflow with intelligent automation",
        "cta": {
          "text": "Get Started",
          "secondary": "Learn More"
        },
        "icon": "🚀",
        "backgroundImage": "https://images.unsplash.com/photo-tech",
        "overlay": true
      }
    },
    {
      "id": "slide-2",
      "componentId": "section",
      "props": {
        "title": "The Problem",
        "subtitle": "What we're solving",
        "icon": "⚠️",
        "number": 1
      }
    },
    {
      "id": "slide-3",
      "componentId": "bullet_list",
      "props": {
        "title": "Challenges Businesses Face",
        "subtitle": "The current state of automation",
        "items": [
          "Manual processes waste 40% of employee time",
          "Integration complexity slows innovation",
          "Lack of real-time insights leads to poor decisions",
          "High costs and limited scalability"
        ],
        "icon": "📋",
        "numbered": false,
        "large": false
      }
    },
    {
      "id": "slide-4",
      "componentId": "stats",
      "props": {
        "title": "The Impact",
        "stats": [
          {
            "value": "40%",
            "label": "Time Wasted",
            "icon": "⏰",
            "description": "On manual tasks"
          },
          {
            "value": "$2.5M",
            "label": "Annual Cost",
            "icon": "💰",
            "description": "Of inefficiency"
          },
          {
            "value": "67%",
            "label": "Error Rate",
            "icon": "❌",
            "description": "In manual processes"
          },
          {
            "value": "0",
            "label": "Real-time Insights",
            "icon": "📊",
            "description": "Without automation"
          }
        ],
        "layout": "grid"
      }
    },
    {
      "id": "slide-5",
      "componentId": "section",
      "props": {
        "title": "Our Solution",
        "subtitle": "Intelligent automation made simple",
        "icon": "✨",
        "number": 2
      }
    },
    {
      "id": "slide-6",
      "componentId": "feature",
      "props": {
        "title": "Key Features",
        "subtitle": "Everything you need to automate",
        "features": [
          {
            "title": "AI-Powered Workflows",
            "description": "Build intelligent workflows that learn and adapt",
            "icon": "🤖"
          },
          {
            "title": "No-Code Builder",
            "description": "Create automations without writing code",
            "icon": "🎨"
          },
          {
            "title": "Real-time Analytics",
            "description": "Monitor and optimize performance instantly",
            "icon": "📈"
          },
          {
            "title": "Secure & Compliant",
            "description": "Enterprise-grade security and compliance",
            "icon": "🔒"
          },
          {
            "title": "Seamless Integrations",
            "description": "Connect with 500+ tools and platforms",
            "icon": "🔌"
          },
          {
            "title": "24/7 Support",
            "description": "Expert support whenever you need it",
            "icon": "💬"
          }
        ],
        "layout": "grid"
      }
    },
    {
      "id": "slide-7",
      "componentId": "process",
      "props": {
        "title": "How It Works",
        "steps": [
          {
            "title": "Connect",
            "description": "Link your existing tools and data sources",
            "icon": "🔗"
          },
          {
            "title": "Design",
            "description": "Build workflows with our visual builder",
            "icon": "✏️"
          },
          {
            "title": "Deploy",
            "description": "Launch your automation in minutes",
            "icon": "🚀"
          },
          {
            "title": "Optimize",
            "description": "Monitor and improve with AI insights",
            "icon": "📊"
          }
        ],
        "layout": "horizontal"
      }
    },
    {
      "id": "slide-8",
      "componentId": "before_after",
      "props": {
        "title": "Transformation",
        "before": {
          "title": "Before",
          "items": [
            "40 hours/week on manual tasks",
            "High error rates",
            "Limited scalability",
            "No real-time insights",
            "Frustrated team"
          ]
        },
        "after": {
          "title": "After",
          "items": [
            "Automated 90% of routine tasks",
            "99.9% accuracy",
            "Scale infinitely",
            "Real-time dashboards",
            "Happy, productive team"
          ]
        }
      }
    },
    {
      "id": "slide-9",
      "componentId": "stats",
      "props": {
        "title": "Results",
        "stats": [
          {
            "value": "10x",
            "label": "Faster",
            "icon": "⚡",
            "description": "Process completion time"
          },
          {
            "value": "90%",
            "label": "Cost Reduction",
            "icon": "💰",
            "description": "In operational costs"
          },
          {
            "value": "99.9%",
            "label": "Accuracy",
            "icon": "✓",
            "description": "Error-free execution"
          },
          {
            "value": "24/7",
            "label": "Availability",
            "icon": "🌍",
            "description": "Always running"
          }
        ],
        "layout": "grid"
      }
    },
    {
      "id": "slide-10",
      "componentId": "quote",
      "props": {
        "quote": "This platform transformed how we work. We've saved hundreds of hours and improved our accuracy dramatically.",
        "author": "Sarah Johnson",
        "role": "CTO, TechCorp",
        "image": "https://images.unsplash.com/photo-sarah",
        "large": true
      }
    },
    {
      "id": "slide-11",
      "componentId": "pricing",
      "props": {
        "title": "Choose Your Plan",
        "plans": [
          {
            "name": "Starter",
            "price": "$99",
            "period": "month",
            "features": [
              "Up to 10 workflows",
              "1,000 tasks/month",
              "Basic integrations",
              "Email support"
            ],
            "cta": "Start Free Trial"
          },
          {
            "name": "Professional",
            "price": "$299",
            "period": "month",
            "features": [
              "Unlimited workflows",
              "10,000 tasks/month",
              "All integrations",
              "Priority support",
              "Advanced analytics",
              "Custom branding"
            ],
            "highlighted": true,
            "cta": "Get Started"
          },
          {
            "name": "Enterprise",
            "price": "Custom",
            "features": [
              "Unlimited everything",
              "Dedicated support",
              "SLA guarantee",
              "Custom integrations",
              "Advanced security",
              "On-premise option"
            ],
            "cta": "Contact Sales"
          }
        ]
      }
    },
    {
      "id": "slide-12",
      "componentId": "roadmap",
      "props": {
        "title": "Product Roadmap",
        "phases": [
          {
            "phase": "Q1 2024",
            "timeframe": "Jan-Mar",
            "items": [
              "AI workflow optimization",
              "Advanced analytics dashboard",
              "Mobile app release"
            ],
            "status": "completed"
          },
          {
            "phase": "Q2 2024",
            "timeframe": "Apr-Jun",
            "items": [
              "Voice-activated commands",
              "Multi-language support",
              "API v2.0 launch"
            ],
            "status": "in-progress"
          },
          {
            "phase": "Q3 2024",
            "timeframe": "Jul-Sep",
            "items": [
              "ML-powered predictions",
              "Blockchain integration",
              "Enterprise suite"
            ],
            "status": "planned"
          }
        ]
      }
    },
    {
      "id": "slide-13",
      "componentId": "cta",
      "props": {
        "title": "Ready to Transform Your Workflow?",
        "subtitle": "Join 10,000+ companies already using our platform",
        "description": "Start your free 30-day trial today. No credit card required.",
        "primaryButton": {
          "text": "Start Free Trial"
        },
        "secondaryButton": {
          "text": "Schedule Demo"
        },
        "icon": "🎯",
        "features": [
          "30-day free trial",
          "No credit card required",
          "Cancel anytime"
        ]
      }
    },
    {
      "id": "slide-14",
      "componentId": "end",
      "props": {
        "title": "Thank You!",
        "subtitle": "Let's build the future together",
        "contactInfo": {
          "email": "hello@example.com",
          "phone": "+1 (555) 123-4567",
          "website": "https://example.com",
          "social": [
            { "platform": "Twitter", "handle": "@example" },
            { "platform": "LinkedIn", "handle": "/company/example" }
          ]
        }
      }
    }
  ]
}
```

## Component Usage Examples

### Hero Slide
```tsx
<HeroSlide
  title="Welcome"
  subtitle="To the future"
  description="Making presentations beautiful"
  cta={{ text: "Get Started", secondary: "Learn More" }}
  icon="🚀"
  backgroundImage="/hero.jpg"
  overlay={true}
  palette={palette}
/>
```

### Stats Slide
```tsx
<StatsSlide
  title="Our Impact"
  stats={[
    { value: "10k+", label: "Users", icon: "👥" },
    { value: "99%", label: "Uptime", icon: "⚡" },
  ]}
  layout="grid"
  palette={palette}
/>
```

### Timeline Slide
```tsx
<TimelineSlide
  title="Our Journey"
  items={[
    { date: "2020", title: "Founded", description: "Started with a vision", icon: "🌱" },
    { date: "2021", title: "Growth", description: "Expanded to 10 countries", icon: "🚀" },
  ]}
  orientation="horizontal"
  palette={palette}
/>
```

### Quiz Slide
```tsx
<QuizSlide
  question="What is the capital of France?"
  options={[
    { text: "London", correct: false },
    { text: "Paris", correct: true, explanation: "Paris is the capital and largest city of France" },
    { text: "Berlin", correct: false },
  ]}
  palette={palette}
/>
```

## Theme Application

Apply themes using data attributes:

```tsx
<div data-theme="modern">
  <HeroSlide {...props} theme="modern" />
</div>
```

Available themes:
- `corporate` - Professional business
- `modern` - Contemporary with gradients
- `minimal` - Clean and simple
- `dark` - Sleek dark mode
- `creative` - Bold and striking
- `academic` - Scholarly style

## Custom Styling

Override component styles with CSS variables:

```css
:root[data-theme="custom"] {
  --slide-font-heading: 'Custom Font', sans-serif;
  --slide-border-radius: 2rem;
  --slide-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

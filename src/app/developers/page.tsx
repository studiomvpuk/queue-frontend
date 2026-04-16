'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import CodeBlock from '@/components/CodeBlock';
import { ArrowRight, Code2, Zap, Lock } from 'lucide-react';

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-qe-bg">
      {/* Navigation */}
      <nav className="bg-qe-surface border-b border-qe-line sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-qe-6 py-qe-4 flex items-center justify-between">
          <Link href="/" className="text-qe-h2 font-800 text-qe-brand-500">
            QueueEase
          </Link>
          <div className="flex gap-qe-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/admin/api-clients">
              <Button variant="primary">Get API Keys</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-qe-6 py-qe-12">
        {/* Hero */}
        <div className="space-y-qe-8 mb-qe-16">
          <div className="space-y-qe-4">
            <h1 className="text-qe-display font-800 text-qe-ink leading-tight">
              Build with QueueEase
            </h1>
            <p className="text-qe-h3 text-qe-ink-2 max-w-2xl">
              Integrate real-time queue management into your platform. Simple REST API + WebSocket support.
            </p>
          </div>

          <div className="flex gap-qe-4">
            <Link href="#auth">
              <Button variant="primary" className="flex items-center gap-qe-2">
                Documentation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a
              href="mailto:dev@queueease.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary">Contact us</Button>
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-qe-8 mb-qe-16">
          <div className="space-y-qe-4">
            <div className="w-12 h-12 rounded-qe-lg bg-qe-brand-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-qe-brand-500" />
            </div>
            <h3 className="text-qe-h2 font-700 text-qe-ink">Real-time</h3>
            <p className="text-qe-body text-qe-ink-2">
              WebSocket connections for instant queue updates and customer notifications.
            </p>
          </div>

          <div className="space-y-qe-4">
            <div className="w-12 h-12 rounded-qe-lg bg-qe-brand-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-qe-brand-500" />
            </div>
            <h3 className="text-qe-h2 font-700 text-qe-ink">Secure</h3>
            <p className="text-qe-body text-qe-ink-2">
              OAuth 2.0 authentication, API key scopes, and webhook signature verification.
            </p>
          </div>

          <div className="space-y-qe-4">
            <div className="w-12 h-12 rounded-qe-lg bg-qe-brand-100 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-qe-brand-500" />
            </div>
            <h3 className="text-qe-h2 font-700 text-qe-ink">Developer-friendly</h3>
            <p className="text-qe-body text-qe-ink-2">
              SDKs for TypeScript, Python, and Go. Comprehensive error handling.
            </p>
          </div>
        </div>

        {/* Auth Section */}
        <div id="auth" className="space-y-qe-8 mb-qe-16">
          <div>
            <h2 className="text-qe-h1 font-800 text-qe-ink mb-qe-4">Authentication</h2>
            <p className="text-qe-h3 text-qe-ink-2">
              QueueEase supports OAuth 2.0 for user-authorized access and API keys for server-to-server integration.
            </p>
          </div>

          <div className="space-y-qe-6">
            <div className="bg-qe-surface rounded-qe-lg p-qe-8 border border-qe-line">
              <h3 className="text-qe-h2 font-700 text-qe-ink mb-qe-4">OAuth 2.0 Flow</h3>
              <ol className="space-y-qe-4 text-qe-body text-qe-ink-2">
                <li className="flex gap-qe-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-qe-brand-500 text-qe-surface flex items-center justify-center font-700 text-qe-small">
                    1
                  </span>
                  <span>
                    Redirect users to{' '}
                    <code className="bg-qe-surface-2 px-qe-2 py-qe-1 rounded font-mono text-qe-small">
                      /oauth/authorize
                    </code>
                  </span>
                </li>
                <li className="flex gap-qe-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-qe-brand-500 text-qe-surface flex items-center justify-center font-700 text-qe-small">
                    2
                  </span>
                  <span>User grants permission</span>
                </li>
                <li className="flex gap-qe-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-qe-brand-500 text-qe-surface flex items-center justify-center font-700 text-qe-small">
                    3
                  </span>
                  <span>
                    Exchange code for token at{' '}
                    <code className="bg-qe-surface-2 px-qe-2 py-qe-1 rounded font-mono text-qe-small">
                      /oauth/token
                    </code>
                  </span>
                </li>
              </ol>

              <CodeBlock
                code={`curl -X POST https://api.queueease.io/oauth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "code": "AUTH_CODE",
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET"
  }'`}
                language="bash"
                title="Exchange authorization code"
              />
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div id="endpoints" className="space-y-qe-8 mb-qe-16">
          <div>
            <h2 className="text-qe-h1 font-800 text-qe-ink mb-qe-4">API Endpoints</h2>
            <p className="text-qe-h3 text-qe-ink-2">
              All endpoints are prefixed with{' '}
              <code className="bg-qe-surface-2 px-qe-2 py-qe-1 rounded font-mono">
                /api/v1
              </code>
            </p>
          </div>

          <div className="space-y-qe-6">
            {/* Locations */}
            <div className="bg-qe-surface rounded-qe-lg p-qe-6 border border-qe-line space-y-qe-4">
              <div className="flex items-center gap-qe-3">
                <span className="px-qe-2 py-qe-1 bg-qe-note-sky rounded font-mono text-qe-small font-700">
                  GET
                </span>
                <code className="font-mono text-qe-body text-qe-ink font-600">
                  /locations
                </code>
              </div>
              <p className="text-qe-body text-qe-ink-2">
                List all locations with optional filtering (category, search, location).
              </p>
              <CodeBlock
                code={`{
  "data": [
    {
      "id": "loc_123",
      "name": "Downtown Clinic",
      "category": "Healthcare",
      "priorityEnabled": true,
      "priorityPrice": 500
    }
  ]
}`}
                language="json"
                title="Response"
              />
            </div>

            {/* Bookings */}
            <div className="bg-qe-surface rounded-qe-lg p-qe-6 border border-qe-line space-y-qe-4">
              <div className="flex items-center gap-qe-3">
                <span className="px-qe-2 py-qe-1 bg-qe-note-mint rounded font-mono text-qe-small font-700">
                  POST
                </span>
                <code className="font-mono text-qe-body text-qe-ink font-600">
                  /bookings
                </code>
              </div>
              <p className="text-qe-body text-qe-ink-2">
                Create a new booking for a location.
              </p>
              <CodeBlock
                code={`{
  "locationId": "loc_123",
  "slotStart": "09:30",
  "isPriority": true,
  "paymentReference": "ref_paystack_123"
}`}
                language="json"
                title="Request body"
              />
            </div>

            {/* Payments */}
            <div className="bg-qe-surface rounded-qe-lg p-qe-6 border border-qe-line space-y-qe-4">
              <div className="flex items-center gap-qe-3">
                <span className="px-qe-2 py-qe-1 bg-qe-note-blush rounded font-mono text-qe-small font-700">
                  POST
                </span>
                <code className="font-mono text-qe-body text-qe-ink font-600">
                  /payments/paystack/initialize
                </code>
              </div>
              <p className="text-qe-body text-qe-ink-2">
                Initialize a payment for a priority slot.
              </p>
              <CodeBlock
                code={`{
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "ref_paystack_123"
}`}
                language="json"
                title="Response"
              />
            </div>
          </div>
        </div>

        {/* SDKs */}
        <div id="sdks" className="space-y-qe-8 mb-qe-16">
          <div>
            <h2 className="text-qe-h1 font-800 text-qe-ink mb-qe-4">SDK Examples</h2>
          </div>

          <div className="space-y-qe-6">
            <CodeBlock
              code={`import { QueueEase } from '@queueease/sdk';

const client = new QueueEase({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
});

const locations = await client.locations.list();
const booking = await client.bookings.create({
  locationId: 'loc_123',
  slotStart: '09:30',
  isPriority: true,
});`}
              language="typescript"
              title="TypeScript"
            />

            <CodeBlock
              code={`from queueease import QueueEase

client = QueueEase(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET'
)

locations = client.locations.list()
booking = client.bookings.create(
    location_id='loc_123',
    slot_start='09:30',
    is_priority=True
)`}
              language="python"
              title="Python"
            />

            <CodeBlock
              code={`package main

import "github.com/queueease/go-sdk"

func main() {
    client := queueease.New(
        "YOUR_CLIENT_ID",
        "YOUR_CLIENT_SECRET",
    )

    locations, _ := client.Locations.List(ctx)
    booking, _ := client.Bookings.Create(ctx, &queueease.BookingRequest{
        LocationID: "loc_123",
        SlotStart:  "09:30",
        IsPriority: true,
    })
}`}
              language="go"
              title="Go"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-qe-surface-2 rounded-qe-lg p-qe-8 text-center space-y-qe-6 border border-qe-line">
          <div>
            <h3 className="text-qe-h2 font-700 text-qe-ink">Ready to build?</h3>
            <p className="text-qe-body text-qe-ink-2 mt-qe-2">
              Get your API keys and start integrating today.
            </p>
          </div>

          <div className="flex gap-qe-4 justify-center">
            <Link href="/login">
              <Button variant="primary">Sign in</Button>
            </Link>
            <a href="mailto:dev@queueease.io" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">Contact sales</Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-qe-surface border-t border-qe-line mt-qe-16">
        <div className="max-w-6xl mx-auto px-qe-6 py-qe-8">
          <p className="text-qe-small text-qe-ink-3 text-center">
            © 2026 QueueEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

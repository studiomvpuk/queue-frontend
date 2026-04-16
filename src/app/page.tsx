'use client';

import React from 'react';
import Link from 'next/link';
import { Button, HeroNumber } from '@/components/ui';
import { Clock, Users, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-qe-bg">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-qe-8 py-qe-6 max-w-7xl mx-auto">
        <div className="text-qe-h2 font-800 text-qe-brand-500">QueueEase</div>
        <div className="flex items-center gap-qe-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Staff Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="md">
              Register Business
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-qe-8 py-qe-12 lg:py-qe-20 text-center">
        <h1 className="text-qe-display font-800 text-qe-ink mb-qe-6 tracking-qe-tight">
          Skip the Line Before You Leave the House
        </h1>
        <p className="text-qe-h3 text-qe-ink-2 mb-qe-10 max-w-2xl mx-auto leading-relaxed">
          Real-time queue management for businesses. Serve customers faster, reduce wait times, and keep everyone happy.
        </p>
        <div className="flex gap-qe-4 justify-center flex-wrap">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Register Your Business
              <ArrowRight className="w-5 h-5 ml-qe-2 inline-block" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg">
              Staff Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-qe-8 py-qe-12 grid grid-cols-1 md:grid-cols-3 gap-qe-8">
        <div className="text-center">
          <HeroNumber number="3" label="Simple Steps" sublabel="Register → Set Up → Go Live" variant="brand-500" />
        </div>
        <div className="text-center">
          <HeroNumber number="99%" label="Uptime" sublabel="Always available" variant="live" />
        </div>
        <div className="text-center">
          <HeroNumber number="50%" label="Avg Wait Reduction" sublabel="With smart queues" variant="warn" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-qe-8 py-qe-12 lg:py-qe-20">
        <h2 className="text-qe-h1 font-800 text-qe-ink text-center mb-qe-12">Features Built for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-qe-8">
          {/* Feature Card 1 */}
          <div className="bg-qe-surface rounded-qe-xl p-qe-8 shadow-qe-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-qe-brand-100 mb-qe-6 mx-auto">
              <Clock className="w-8 h-8 text-qe-brand-500" />
            </div>
            <h3 className="text-qe-h3 font-700 text-qe-ink text-center mb-qe-4">Live Queue Tracking</h3>
            <p className="text-qe-body text-qe-ink-3 text-center leading-relaxed">
              See exactly where customers are in the queue. Update status in real-time as they arrive and get served.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-qe-surface rounded-qe-xl p-qe-8 shadow-qe-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-qe-brand-100 mb-qe-6 mx-auto">
              <Users className="w-8 h-8 text-qe-brand-500" />
            </div>
            <h3 className="text-qe-h3 font-700 text-qe-ink text-center mb-qe-4">Walk-In Management</h3>
            <p className="text-qe-body text-qe-ink-3 text-center leading-relaxed">
              Quickly add walk-in customers to the queue right from your reception desk. Track everything in one place.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-qe-surface rounded-qe-xl p-qe-8 shadow-qe-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-qe-brand-100 mb-qe-6 mx-auto">
              <Zap className="w-8 h-8 text-qe-brand-500" />
            </div>
            <h3 className="text-qe-h3 font-700 text-qe-ink text-center mb-qe-4">Keyboard Shortcuts</h3>
            <p className="text-qe-body text-qe-ink-3 text-center leading-relaxed">
              Fast operations. Hit Space to call next, S to serve, N for no-show. Built for speed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-qe-brand-500 py-qe-12">
        <div className="max-w-4xl mx-auto px-qe-8 text-center">
          <h2 className="text-qe-h1 font-800 text-qe-surface mb-qe-6">Ready to Transform Your Queue?</h2>
          <p className="text-qe-h3 text-qe-surface mb-qe-10 opacity-95">
            Register your business and start managing your queue in minutes
          </p>
          <div className="flex gap-qe-4 justify-center flex-wrap">
            <Link href="/register">
              <Button variant="secondary" size="lg" className="text-qe-brand-500">
                Register Your Business
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="text-qe-surface border border-white/30 hover:bg-white/10">
                Already registered? Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-qe-surface border-t border-qe-line py-qe-8">
        <div className="max-w-7xl mx-auto px-qe-8 text-center text-qe-ink-3 text-qe-small">
          <p>QueueEase • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

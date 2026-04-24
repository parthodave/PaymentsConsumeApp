import { Component, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PaymentsConsumeApp');
  protected readonly message = signal('');
  protected readonly isSubmitting = signal(false);

  private readonly platformId = inject(PLATFORM_ID);

  // Get API endpoint from environment variable or default
  private getApiEndpoint(): string {
    // Only access window in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const envVar = (window as any).__STATIC_WEB_APP_CONFIG__?.env?.API_ENDPOINT;
      if (envVar) {
        return envVar;
      }
    }
    // Default fallback
    return 'https://payment-api-parthodave-c8hmc4a7h0chekdv.centralindia-01.azurewebsites.net';
  }

  async submitPayment(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const account = (fd.get('accountNumber') || '').toString().trim();
    const amountRaw = (fd.get('amount') || '').toString().trim();
    const amount = parseFloat(amountRaw || '0');

    if (!account) {
      this.message.set('Account number is required');
      return;
    }

    if (!amount || Number.isNaN(amount)) {
      this.message.set('Enter a valid amount');
      return;
    }

    this.isSubmitting.set(true);
    this.message.set('');

    try {
      const payload = { AccountNumber: account, Amount: amount };
      const apiEndpoint = this.getApiEndpoint();
      const res = await fetch(`${apiEndpoint}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        this.message.set('Error: ' + res.status + ' ' + (text || res.statusText));
      } else {
        this.message.set('Payment submitted successfully');
        form.reset();
      }
    } catch (err: any) {
      this.message.set('Network error: ' + (err?.message || err));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

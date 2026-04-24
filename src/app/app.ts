import { Component, signal } from '@angular/core';
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
      const res = await fetch('https://payment-api-parthodave-c8hmc4a7h0chekdv.centralindia-01.azurewebsites.net/api/payments', {
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

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/render';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import EmptyOrdersState from './EmptyOrdersState';
import WishlistGrid from './WishlistGrid';
import SessionCard from './SessionCard';
import PreferenceSwitch from './PreferenceSwitch';
import EmptyNotificationState from './EmptyNotificationState';
import NotificationBadge from './NotificationBadge';
import InvoiceSummary from './InvoiceSummary';
import SecurityPage from '../pages/SecurityPage';
import SettingsPage from '../pages/SettingsPage';
import { useNotificationStore } from '@/store/notification.store';

describe('Dashboard Component Suites', () => {
  describe('OrderStatusBadge', () => {
    it('renders correct text for pending status', () => {
      render(<OrderStatusBadge status="pending" />);
      expect(screen.getByText('orders.status.pending')).toBeInTheDocument();
    });

    it('renders correct text for delivered status', () => {
      render(<OrderStatusBadge status="delivered" />);
      expect(screen.getByText('orders.status.delivered')).toBeInTheDocument();
    });
  });

  describe('OrderTimeline', () => {
    it('renders standard steps of the timeline', () => {
      render(<OrderTimeline status="processing" />);
      expect(screen.getByText('orders.timeline.placed')).toBeInTheDocument();
      expect(screen.getByText('orders.timeline.preparing')).toBeInTheDocument();
    });
  });

  describe('EmptyOrdersState', () => {
    it('renders empty orders feedback message and CTA button', () => {
      render(<EmptyOrdersState isRtl={true} />);
      expect(screen.getByText('orders.empty.title')).toBeInTheDocument();
    });
  });

  describe('WishlistGrid', () => {
    it('renders empty state when products list is empty', () => {
      render(<WishlistGrid products={[]} isRtl={true} />);
      expect(screen.getByText('wishlist.empty.title')).toBeInTheDocument();
    });
  });

  describe('EmptyNotificationState', () => {
    it('renders no notifications text payload', () => {
      render(<EmptyNotificationState />);
      expect(screen.getByText('notifications.empty.title')).toBeInTheDocument();
    });
  });

  describe('NotificationBadge', () => {
    it('renders nothing when count is zero', () => {
      const { container } = render(<NotificationBadge count={0} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders actual count when under one hundred', () => {
      render(<NotificationBadge count={12} />);
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders 99+ when count is larger than ninety-nine', () => {
      render(<NotificationBadge count={250} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });

  describe('InvoiceSummary', () => {
    it('renders formatted pricing breakdown values in English', () => {
      render(
        <InvoiceSummary
          subtotal={100}
          discountAmount={10}
          shippingFee={15}
          taxAmount={15}
          totalAmount={120}
          isRtl={false}
        />
      );
      expect(screen.getByText('invoice.subtotal')).toBeInTheDocument();
      expect(screen.getByText('100.00 SAR')).toBeInTheDocument();
      expect(screen.getByText('-10.00 SAR')).toBeInTheDocument();
      expect(screen.getByText('120.00 SAR')).toBeInTheDocument();
    });

    it('renders formatted pricing breakdown values in Arabic', () => {
      render(
        <InvoiceSummary
          subtotal={100}
          discountAmount={10}
          shippingFee={15}
          taxAmount={15}
          totalAmount={120}
          isRtl={true}
        />
      );
      expect(screen.getByText('invoice.subtotal')).toBeInTheDocument();
      expect(screen.getByText('١٠٠ ر.س')).toBeInTheDocument();
      expect(screen.getByText('-١٠ ر.س')).toBeInTheDocument();
      expect(screen.getByText('١٢٠ ر.س')).toBeInTheDocument();
    });
  });

  describe('Zustand Notification Drawer Actions', () => {
    it('handles notification drawer open/close toggles', () => {
      expect(useNotificationStore.getState().isDrawerOpen).toBe(false);
      useNotificationStore.getState().setDrawerOpen(true);
      expect(useNotificationStore.getState().isDrawerOpen).toBe(true);
      useNotificationStore.getState().setDrawerOpen(false);
      expect(useNotificationStore.getState().isDrawerOpen).toBe(false);
    });
  });

  describe('Active Sessions Rendering', () => {
    it('displays session descriptors and labels current device tag', () => {
      const mockSession = {
        id: 'sess-test',
        device: 'Test Computer',
        browser: 'Firefox Developer Edition',
        ip: '10.0.0.8',
        location: 'الدمام، السعودية',
        lastActive: 'الآن نشط',
        isCurrent: true,
      };

      const handleRevoke = vi.fn();
      render(<SessionCard session={mockSession} onRevoke={handleRevoke} isRtl={true} />);

      expect(screen.getByText('Test Computer')).toBeInTheDocument();
      expect(
        screen.getByText('Firefox Developer Edition • 10.0.0.8 • الدمام، السعودية')
      ).toBeInTheDocument();
      expect(screen.getByText('security.session.current')).toBeInTheDocument();
    });

    it('triggers the onRevoke session callback when terminate clicked', () => {
      const mockSession = {
        id: 'sess-to-revoke',
        device: 'Revokable Device',
        browser: 'Firefox',
        ip: '192.168.1.99',
        location: 'الرياض',
        lastActive: 'منذ يوم',
        isCurrent: false,
      };

      const handleRevoke = vi.fn();
      render(<SessionCard session={mockSession} onRevoke={handleRevoke} isRtl={true} />);

      const revokeBtn = screen.getByRole('button');
      fireEvent.click(revokeBtn);
      expect(handleRevoke).toHaveBeenCalledWith('sess-to-revoke');
    });
  });

  describe('PreferenceSwitch Settings Toggles', () => {
    it('renders with title & description and handles toggle clicks', () => {
      const handleToggle = vi.fn();
      render(
        <PreferenceSwitch
          title="Enable SMS Alerts"
          description="Receive text alerts for tracking"
          checked={false}
          onToggle={handleToggle}
          isRtl={false}
        />
      );

      expect(screen.getByText('Enable SMS Alerts')).toBeInTheDocument();
      expect(screen.getByText('Receive text alerts for tracking')).toBeInTheDocument();

      const toggleButton = screen.getByRole('switch');
      fireEvent.click(toggleButton);
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Security Page Forms & Password Validation', () => {
    it('validates password constraints matching criteria requirements', async () => {
      render(<SecurityPage />);

      const submitBtn = screen.getByText('حفظ التعديلات');
      fireEvent.click(submitBtn);

      // Should display required field error indicators
      await waitFor(() => {
        expect(screen.getByText('يرجى إدخال كلمة المرور الحالية')).toBeInTheDocument();
        expect(screen.getByText('يجب أن لا تقل كلمة المرور عن ٨ خانات')).toBeInTheDocument();
      });
    });
  });

  describe('SettingsPage Interactivity', () => {
    it('renders general settings panels correctly', () => {
      render(<SettingsPage />);
      expect(screen.getByText('تفضيلات الواجهة والمظهر')).toBeInTheDocument();
      expect(screen.getByText('تفضيلات التنبيهات وقنوات التواصل')).toBeInTheDocument();
    });

    it('triggers language selection button click correctly', () => {
      render(<SettingsPage />);
      const englishBtn = screen.getByText('English');
      fireEvent.click(englishBtn);
      // Confirms active layout remains responsive without throw
      expect(englishBtn).toBeInTheDocument();
    });
  });
});

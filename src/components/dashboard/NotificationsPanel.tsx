import { Notification } from '@/mocks/dashboard';

interface NotificationsProps {
  notifications: Notification[];
}

export function NotificationsPanel({ notifications }: NotificationsProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <div className="w-2 h-2 rounded-full bg-[#1886FF]" />;
      case 'request':
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'dispute':
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-[#737373]" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#171717]">Notifications</h2>
        <button className="text-sm font-medium text-[#1886FF] hover:text-[#62D0FF] transition-colors">
          Mark all as read
        </button>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[#737373] text-sm">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E5]">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-[#F5F5F5] transition-colors cursor-pointer flex gap-4 ${
                  !notif.isRead ? 'bg-[#E4F9FF]/30' : ''
                }`}
              >
                <div className="mt-2 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-semibold truncate ${!notif.isRead ? 'text-[#171717]' : 'text-[#737373]'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-[#737373] whitespace-nowrap ml-2">
                      {new Date(notif.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#737373] line-clamp-2">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-[#E5E5E5] text-center">
        <button className="text-sm font-medium text-[#737373] hover:text-[#1886FF] transition-colors">
          View all notifications
        </button>
      </div>
    </div>
  );
}

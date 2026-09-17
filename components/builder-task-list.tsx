import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { BuildTask } from '@/types';

export function BuilderTaskList({ tasks }: { tasks: BuildTask[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/45">Build timeline</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Generation pipeline</h3>
        </div>
        <Badge tone="info">Live status</Badge>
      </div>
      <div className="mt-5 space-y-3">
        {tasks.map((task, index) => (
          <div key={`${task.id}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs text-white/45">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-white/72">{task.label}</span>
            </div>
            <Badge tone={task.status === 'completed' ? 'success' : task.status === 'running' ? 'info' : task.status === 'error' ? 'danger' : 'default'}>{task.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

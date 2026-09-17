import { Card } from '@/components/ui/card';

const schemaGroups = [
  ['Users', 'Organizations', 'Memberships'],
  ['Projects', 'ProjectVersions', 'ProjectFiles', 'ProjectPages'],
  ['AIConversations', 'AIMessages', 'AIUsage'],
  ['Subscriptions', 'Invoices', 'Deployments', 'Domains', 'Integrations'],
  ['Notifications', 'ApiKeys', 'AuditLogs', 'Comments']
];

export function SchemaGraph() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/45">Schema graph</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Production-ready entity map</h3>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {schemaGroups.map((group) => (
          <div key={group[0]} className="space-y-3">
            {group.map((item, index) => (
              <div key={item} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
                {item}
                {index < group.length - 1 && <div className="absolute left-1/2 top-full h-4 w-px -translate-x-1/2 bg-white/10" />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          'Users → Organizations → Projects',
          'Projects → Versions → Files',
          'Projects → Deployments → Domains',
          'Organizations → Subscriptions → Invoices'
        ].map((relationship) => (
          <div key={relationship} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/55">
            {relationship}
          </div>
        ))}
      </div>
    </Card>
  );
}

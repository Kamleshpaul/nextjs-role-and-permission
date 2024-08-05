import Guard from "@/components/server/Guard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/server/queries/user";
import { permissionList } from "@/utils/constants";

export default async function Dashboard() {
  const user = await getCurrentUser();
  const permissions = [
    { name: "Post Show", permission: permissionList.POST_SHOW },
    { name: "Post Create", permission: permissionList.POST_CREATE },
    { name: "Post Edit", permission: permissionList.POST_EDIT },
    { name: "Post Delete", permission: permissionList.POST_DELETE },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-start flex-col">
        <h1 className="text-lg font-semibold md:text-2xl">Permissions Modules</h1>
        <p>You are  - <b>{user?.role.name}</b></p>
      </div>
      <div
        className="flex flex-1 flex-wrap items-center justify-center gap-4 rounded-lg border border-dashed shadow-sm p-4"
        x-chunk="dashboard-02-chunk-1"
      >
        {permissions.map((item, index) => (
          <Guard
            key={index}
            permissions={[item.permission]}
          >
            <Button>
              {item.name}
            </Button>
          </Guard>
        ))}
      </div>
    </main>
  );
}

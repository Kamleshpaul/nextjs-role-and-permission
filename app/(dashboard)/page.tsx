import { Button } from "@/components/ui/button";
import { getMyPermissions } from "@/server/queries/user";

export default async function Dashboard() {

  const myPermission = await getMyPermissions();

  const permissions = [
    { name: "Post Show" },
    { name: "Post Create" },
    { name: "Post Edit" },
    { name: "Post Delete" },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Permissions Modules</h1>
      </div>
      <div
        className="flex flex-1 flex-wrap items-center justify-center gap-4 rounded-lg border border-dashed shadow-sm p-4"
        x-chunk="dashboard-02-chunk-1"
      >
        {permissions.map((permission, index) => (
          <button
            key={index}
            className="flex items-center justify-center w-40 h-20 p-4 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200"
          >
            {permission.name}
          </button>
        ))}
      </div>
    </main>
  );
}

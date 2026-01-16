import { getKomodoClient } from '@/lib/komodo';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listKomodoStacksRoute } from './get.route';

export const listKomodoStacksHandler: RouteHandler<
  typeof listKomodoStacksRoute
> = async (c) => {
  try {
    const komodo = await getKomodoClient();
    const [stacks, servers, tags] = await Promise.all([
      komodo.read('ListStacks', {}),
      komodo.read('ListServers', {}),
      komodo.read('ListTags', {}),
    ]);

    const tagMap = new Map(tags.map((t: any) => [t._id?.$oid, t.name]));
    const serverMap = new Map(
      servers.map((server) => [server.id || '', server.name || '']),
    );

    const mappedStacks = stacks.map((stack: any) => ({
      ...stack,
      server_name:
        serverMap.get(stack.info?.server_id) || stack.info?.server_id || '',
      tags:
        stack.tags?.map((tagId: string) => tagMap.get(tagId) || tagId) || [],
    }));

    const metadata = {
      exists: stacks.length > 0,
      total_stacks: stacks.length,
      total_servers: servers.length,
      servers: servers.map((server) => server.name),
      total_tags: tags.length,
      tags: tags.map((t: any) => t.name),
    };

    return c.json(
      {
        response: mappedStacks,
        metadata,
      },
      200,
    );
  } catch (error) {
    console.error('[Komodo List Stacks] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};

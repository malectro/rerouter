# Rerouter

Rerouter is a standalone routing library written for React and similar to `react-router`.

## Philosophy
Rerouter intends to be a router for React Fiber and Suspense.

Historically, routing libraries written for web UI would resolve a set of routes (declarative or procedural) all at once, eventually resulting in a view or set of components. Sometimes this process would involve transitions or async dependencies to determine whether or not a piece of UI could be seen.

Here's how I might describe Express's routing system at its most simplistic. Notice that this system would work in most environments and ignores the existence of React.
```javascript
async function route(pathname) {
    for (const route of routes) {
        if (matches(route, pathname)) {
            const view = await route.callback();
            if (view) {
                return view;
            }
        }
    }
}
```

React 17 officially introduces the concept of prerendering. This means that when state changes, React will start to render the next tree before it replaces the old one. If the next tree indicates an async dependency, React will wait for that resource before it transitions to the next tree. React also allows for aborting the transition -- essentially throwing out the prerendered tree in favor of a new state change.

All of this behavior is very similar to that of a routing library -- to the point where it would seem silly to include code that accomplishes a nearly identical goal. Within a React application, it makes sense for React to handle state management, subscriptions, and rendering.

And using React to handle routing provides a few more unique benefits:
- Async dependencies can exist anywhere in the component tree, not just at the routing level.
- Components can opt in to pending transitions between pages. In other words, routing can be instant or async, depending on the link that triggers it.
- Resources can be preloaded, which can make route transitions even faster. In very high-performance web apps, preloading is often triggered on hover of a link or button.
- Code splitting is built in using `React.lazy`.

## Usage
Rerouter takes full advantage of React's state management and subscription systems but still uses the History and Location APIs as a source of truth. In practice, this means a few things:

A Router provider must be rendered near the top of the application tree. This provides subscription access to the location and history anywhere in the application, but it importantly does not care how routing is accomplished – making it a fairly simple component.

A `useRoutes` hook provides the basis for actual routing. It takes a list of routes and returns a React subtree based on how they match the current location pathname. There are a few important aspects of this:
- Routing is always synchronous. (Things like `onEnter` and `getComponent` from RR3 do not exist.)
- Because routing is done at render time, the routes themselves can change on the fly. This means we can determine the available routes using things like user roles and privileges.
- Routes are given JSX elements -- not components. This means that props can be easily passed to them.
- `Params` are extracted by `useRoutes` -- not the Router provider. This means that params are only available to children produced by `useRoutes`. In practice this only affects components like `ModalRoot` that will never have access to the route tree.
- `useRoutes` can be called multiple times by different subtrees, which allows collections of routes to be moved to different subpaths and namespaces at will. It also means we can code split at the route level using `React.lazy`.

Here is some JSX pseudocode that outlines the way a Rerouter application might look.
```jsx
function App() {
    return (
        <RerouterProvider>
            <AppRoutes />
        </RerouterProvider>
    );
}

function AppRoutes() {
    return useRoutes([
        {path: '', exact: true, element: <Dashboard />},
        {path: 'posts', element: <PostsRoutes />},
        {path: '*', element: <NotFound />},
    ]);
}

function PostsRoutes() {
    const isAdmin = useIsAdmin();
    return useRoutes([
        {
            path: ':postId',
            children: [
                {path: '', exact: true, element: ({params: {postId}}) => <PostView postId={postId} />},
                isAdmin && {path: 'edit', element: ({params: {postId}}) => <PostEdit postId={postId} />},
            ],
        },
    ]);
}
```
Notice a few things:
- `PostRoutes` and `Dashboard` are both components, and the router makes no distinctions. The only difference is that `PostRoutes` calls `useRoutes`.
- The ability to edit posts is restricted to admins, and `PostRoutes` handles this at render time. If the user is not an admin, the route effectively does not exist.
- Any element passed to `useRoutes` could be "lazy". Rerouter does not care (or really know the difference).

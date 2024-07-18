import {
  LinksFunction,
  json,
  redirect,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  NavLink,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import { useEffect } from "react";

import { createEmptyContact, getContacts } from "./data";

import appStyleHref from "./app.css?url";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: appStyleHref,
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const { state, location } = useNavigation();
  const submit = useSubmit();
  const searching = location && new URLSearchParams(location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              role="search"
              onChange={(e) => {
                const isFirstSearch = q === null;
                submit(e.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
            >
              <input
                id="q"
                aria-label="Search contacts"
                className={searching ? "loading" : ""}
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={q || ""}
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map(({ id, first, last, favorite }) => (
                  <li key={id}>
                    <NavLink
                      className={({ isActive, isPending }) => {
                        return isActive ? "active" : isPending ? "pending" : "";
                      }}
                      to={`/contacts/${id}`}
                    >
                      {first || last ? (
                        <>
                          {first} {last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                    </NavLink>
                    {favorite ? <span>★</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No contacts</p>
            )}
          </nav>
        </div>
        <div
          id="detail"
          className={state === "loading" && !searching ? "loading" : ""}
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

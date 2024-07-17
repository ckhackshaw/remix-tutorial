import { LinksFunction, json } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  Link,
  useLoaderData,
} from "@remix-run/react";

import { createEmptyContact, getContacts } from "./data";

import appStyleHref from "./app.css?url";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: appStyleHref,
  },
];

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

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
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
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
                    <Link to={`/contacts/${id}`}>
                      {first || last ? (
                        <>
                          {first} {last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                    </Link>
                    {favorite ? <span>★</span> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No contacts</p>
            )}
          </nav>
        </div>
        <div id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

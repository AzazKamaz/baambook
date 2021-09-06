import { writable } from "svelte/store";
import type { Page, Route } from "./types";

export const route = writable<Route>(parseRoute());

function parseRoute(hash?: string): Route {
  hash = hash === undefined ? window.location.hash : hash;
  hash = hash.startsWith('#') ? hash.substr(1) : hash;
  const params = new URLSearchParams(hash);

  const id = params.get('id');
  const key = params.get('key');
  const token = params.get('token');

  const route = {id, key, token};
  return {...route, page: determinePage(route as Route)};
}

function determinePage(route: Route): Page {
  if (route.id && route.key && route.token) {
    return 'scan';
  }
  if (route.id && route.key) {
    return 'show';
  }
  return 'index';
}

window.addEventListener('hashchange', () => route.set(parseRoute()));

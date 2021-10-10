import { writable, get } from "svelte/store";
import { route } from "./route";
import { Socket, Channel } from 'phoenix';
import type { Route, Status } from "./types";

export const data = writable<Status>({status: 'connecting'});

// Disable some linting since 'phoenix' package is not typed
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const socket: Socket = new Socket("/socket");
let active: boolean = false;

let channel: Channel | null = null;

route.subscribe((route: Route) => {
  if (route.page === 'show' || route.page === 'scan') {
    if (!active) {
      socket.connect(), active = true;
      data.set({status: 'connecting'});
    }
  } else if (active) {
    if (channel) {
      channel.leave(), channel = null;
    }
    socket.disconnect(), active = false;
    data.set({status: 'connecting'});
  }

  if (active) {
    const topic = `room:${route.id}`;

    if (channel && (channel.topic !== topic || channel.params.token !== route.token)) {
      channel.off('update');
      channel.off('init');
      channel.leave();
      channel = null;
    }

    if (channel === null) {
      channel = socket.channel(topic, route.page === 'scan' ? {token: route.token} : {});

      channel.onError((reason) => {
        console.log('Error joining', reason);
        data.set({status: 'error'});
      })
      channel.on('init', (msg : {data: string | null}) => {
        data.set({status: 'connected', data: msg.data});
      });
      channel.on('update', (msg : {data: string | null}) => {
        channel.off('init');
        data.set({status: 'connected', data: msg.data});
      });

      data.set({status: 'connecting'});
      channel.join()
        .receive("ok", _resp => data.set({status: 'connected'}))
        .receive("error", _resp => {
          data.set({status: 'error'});
          channel.leave();
        });
    }
  }
});

export function update(upd: string): void {
  if (get(data).status === 'connected') {
    channel.push("update", {data: upd})
      .receive("ok", (msg : {data: string | null}) => {
        console.log("Update success", msg);
        data.set({status: 'connected', data: msg.data});
      })
      .receive("error", (reasons) => console.log("Update failed", reasons));
  }
}

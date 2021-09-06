import { writable, get } from "svelte/store";
import { route } from "./route";
import { Socket, Channel } from 'phoenix';
import type { Route, Status } from "./types";

export const data = writable<Status>({status: 'connecting'});

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
    socket.disconnect(), active = false, channel = null;
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
        .receive("ok", resp => data.set({status: 'connected'}))
        .receive("error", resp => {
          data.set({status: 'error'});
          channel.leave();
        });
    }
  }
});

export function update(upd: string) {
  if (get(data).status === 'connected') {
    data.set({status: 'connected', data: upd});
    channel.push("update", {data: upd})
      .receive("ok", (msg : {data: string | null}) => {
        console.log("Update success", msg);
        data.set({status: 'connected', data: msg.data});
      })
      .receive("error", (reasons) => console.log("Update failed", reasons));
  }
}


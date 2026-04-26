import PusherServer from 'pusher';
import PusherJS from "pusher-js";

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
    useTLS: true,
});

let pusherClient: PusherJS | null = null;

export function getPusherClient(): PusherJS {
    if (!pusherClient) {
        pusherClient = new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY! || '', {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! || '',
        });
    }
    return pusherClient;
}

export const PATIENT_CHANNEL = "patient-updates";
export const PATIENT_EVENT = "form-update";
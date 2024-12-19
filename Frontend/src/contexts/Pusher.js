import Pusher from "pusher-js";

let pusherInstance;

export const getPusher = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher("f6f10b97ea3264514f53", {
      cluster: "ap1",
      cluster: 'ap1',
      forceTLS: true,
      
    });
    Pusher.logToConsole = true;
  }
  return pusherInstance;
};

import { handleSubscribe } from '../subscribe-core.js';

export function onRequestPost(context) {
  return handleSubscribe(context.request, context.env);
}

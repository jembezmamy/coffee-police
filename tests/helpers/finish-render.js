import { waitUntil, getSettledState } from '@ember/test-helpers';

export default function() {
 return waitUntil(() => {
   let { hasRunLoop, hasPendingRequests, hasPendingWaiters } = getSettledState();
   if (hasRunLoop || hasPendingRequests || hasPendingWaiters) {
     return false;
   }
   return true;
 });
}

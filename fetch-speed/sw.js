var pendingFetches = [];
self.addEventListener("fetch", e => {
  if (e.request.url.includes('leave-pending')) {
    var p = new Promise((resolve, reject) => {
      pendingFetches.push(resolve);
    });
    e.respondWith(p);
  }
});

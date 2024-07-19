import { ApplicationConfig } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private _routeStore = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig!.path!;
    return (path && ['discover', 'favorites'].includes(path)) as boolean;
  }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = route.routeConfig!.path!;
    this._routeStore.set(path, handle);
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig!.path!;
    return (path &&
      ['discover', 'favorites'].includes(path) &&
      !!this._routeStore.get(path)) as boolean;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const path = route.routeConfig!.path!;
    return this._routeStore.get(path)!;
  }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

export const provideCustomRouteReuseStrategy = (): ApplicationConfig['providers'] => [
  {
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy
  }
];

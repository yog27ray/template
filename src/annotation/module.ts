import 'reflect-metadata';
import { RequestHandler } from 'express';
import { Container, injectable } from 'inversify';
import { Module, Controller, Service, Model, Base, Subscription } from '../declarations';
import { RouteType } from '../declarations/controller';
import { controllerContainer, modelContainer, serviceContainer } from '../declarations/inversify';

declare interface ModuleType {
  modules?: Array<new () => Module>;
  controller?: new () => Controller;
  service?: new () => Service;
  model?: new () => Model;
  subscription?: new () => Subscription;
}

declare type ApplicationModuleType =
  (new () => Module)
  & { loadContainer?: () => void; loadSubscriptions?: () => void; generateRoutes?: () => Array<RouteType> };

function module(config: ModuleType = {}) {
  function generateRoutes(): Array<RouteType> {
    const routes: Array<RouteType> = [];
    const subRoutes: Array<RouteType> = [];
    if (this.config.modules) {
      this.config.modules.forEach((each: ApplicationModuleType) => {
        const subModuleRoutes: Array<RouteType> = each.generateRoutes();
        subRoutes.push(...subModuleRoutes);
      });
    }
    if (!subRoutes.length) {
      subRoutes.push({ path: '' });
    }
    if (this.config.controller) {
      const controller: Controller = controllerContainer.get(this.config.controller);
      const moduleRoutes = controller.generateRoutes();
      if (!moduleRoutes.length) {
        moduleRoutes.push({ path: '' });
      }
      moduleRoutes.forEach((moduleRoute: RouteType) => {
        const modulePath = moduleRoute.path;
        const moduleMiddleware: Array<RequestHandler> = moduleRoute.middleware || [];
        routes.push(...subRoutes.map((subRoute: RouteType): RouteType => {
          const subRoutePath = subRoute.path;
          const subRouteMiddleware: Array<RequestHandler> = subRoute.middleware || [];
          return {
            path: `${modulePath}${subRoutePath}`,
            middleware: [...moduleMiddleware, ...subRouteMiddleware],
            method: subRoute.method || moduleRoute.path,
          };
        }));
      });
    }
    return routes;
  }

  function loadInContainer(container: Container, target: new () => Base) {
    if (!target) {
      return;
    }
    injectable()(target);
    container.bind(target).to(target);
  }

  function loadSubscriptions(): void {
    if (this.config.modules) {
      this.config.modules.forEach((each: ApplicationModuleType) => each.loadSubscriptions());
    }
    if (!this.config.subscription) {
      return;
    }
    const subscription: Subscription = controllerContainer.get(this.config.subscription);
    subscription.initialize();
  }

  function loadContainer(): void {
    if (this.config.modules) {
      this.config.modules.forEach((each: ApplicationModuleType) => each.loadContainer());
    }
    loadInContainer(controllerContainer, this.config.controller);
    loadInContainer(serviceContainer, this.config.service);
    loadInContainer(modelContainer, this.config.model);
  }

  return function decorator(target: new () => Module) {
    Object.assign(target, { config, loadContainer, generateRoutes, loadSubscriptions });
  }
}

export { module, ApplicationModuleType };

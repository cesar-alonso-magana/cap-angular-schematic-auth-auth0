import { strings } from '@angular-devkit/core';
import { 
  apply,
  template,
  branchAndMerge,
  chain,
  forEach,
  FileEntry,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  Tree,
  url,
  SchematicContext
 } from '@angular-devkit/schematics';
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
  buildRelativePath, 
  findModule, 
  MODULE_EXT, 
  ROUTING_MODULE_EXT
} from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getProjectFromWorkspace } from '@angular/cdk/schematics/utils/get-project';
import {
  addProviderToModule,
  addImportToModule,
  addDeclarationToModule
 } from './vendored-ast-utils';
import { 
  appendToStartFile
} from './cap-utils';
import { Schema as SchemaOptions } from './schema';
import * as ts from 'typescript';;
import { getFileContent } from '@schematics/angular/utility/test';

import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType
} from 'schematics-utilities';

import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';


function readIntoSourceFile(host: Tree, filePath: string) {
  const text = host.read(filePath);
  if (text === null) {
    throw new SchematicsException(`File ${filePath} does not exist.`);
  }
  return ts.createSourceFile(filePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}

function addToNgModule(options: SchemaOptions): Rule {
  return (host: Tree) => {
    
    const modulePath = options.module;
    // Import Header Component and declare
    let source = readIntoSourceFile(host, modulePath);

    const componentPath = `cap-authentication-forked`;
    const relativePath = componentPath;
    const classifiedName = 'AuthenticationModule';
    const importRecorder = host.beginUpdate(modulePath);
    const importChanges: any = addImportToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

    for (const change of importChanges) {
        if (change instanceof InsertChange) {
          console.log('change', change);
          if (change.toAdd === ',\n    AuthenticationModule') {
            change.toAdd = 
`,\n    AuthenticationModule.forRoot({
      domain: '${options.domain}',
      clientId: '${options.clientID}',
      clientSecret: '${options.clientSecret}'
    })
`;
          }
          importRecorder.insertLeft(change.pos, change.toAdd);
        }
    }
    host.commitUpdate(importRecorder);

    // Import and include on Providers the load script StateService
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, modulePath);
        const componentPath = `cap-authentication-forked`;
        const relativePath = componentPath;
        const classifiedName = strings.classify(`StateService`);
        const providerRecorder = host.beginUpdate(modulePath);
        const providerChanges: any = addProviderToModule(
            source,
            modulePath,
            classifiedName,
            relativePath);

        for (const change of providerChanges) {
            if (change instanceof InsertChange) {
                providerRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(providerRecorder);
    }

    // Import and include on Providers the load script StateService
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
        source = readIntoSourceFile(host, modulePath);
        const componentPath = `cap-authentication-forked`;
        const relativePath = componentPath;
        const classifiedName = strings.classify(`GuardService`);
        const providerRecorder = host.beginUpdate(modulePath);
        const providerChanges: any = addProviderToModule(
            source,
            modulePath,
            classifiedName,
            relativePath);

        for (const change of providerChanges) {
            if (change instanceof InsertChange) {
                providerRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(providerRecorder);
    }

    // Import and include on Imports the LoginComponent
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
      let source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/login/login.component`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`LoginComponent`);
      const declarationChanges: any = addDeclarationToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

      const declarationRecorder = host.beginUpdate(modulePath);
      for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
          declarationRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(declarationRecorder);
    }

    // Import and include on Imports the RegisterComponent
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
      let source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/register/register.component`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`RegisterComponent`);
      const declarationChanges: any = addDeclarationToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

      const declarationRecorder = host.beginUpdate(modulePath);
      for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
          declarationRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(declarationRecorder);
    }

    // Import and include on Imports the ForgotComponent
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
      let source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/forgot/forgot.component`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`ForgotComponent`);
      const declarationChanges: any = addDeclarationToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

      const declarationRecorder = host.beginUpdate(modulePath);
      for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
          declarationRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(declarationRecorder);
    }

    // Import and include on Imports the ProfileComponent
    if (options) {
        // Need to refresh the AST because we overwrote the file in the host.
      let source = readIntoSourceFile(host, modulePath);
      const componentPath = `${options.path}/app/profile/profile.component`;
      const relativePath = buildRelativePath(modulePath, componentPath);
      const classifiedName = strings.classify(`ProfileComponent`);
      const declarationChanges: any = addDeclarationToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

      const declarationRecorder = host.beginUpdate(modulePath);
      for (const change of declarationChanges) {
        if (change instanceof InsertChange) {
          declarationRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(declarationRecorder);
    }

    return host;
  };
}

function addAuthRoutes(): Rule {
  return (host: Tree) => {

    const filePath = "src/app/app-routing.module.ts";
    
    // Add routes to routing
    const toAdd = 
`
    { path: 'auth/register', component: RegisterComponent},
    { path: 'auth/login', component: LoginComponent},
    { path: 'auth/forgot-password', component: ForgotComponent},
    { path: 'auth/profile', component : ProfileComponent, canActivate: [GuardService]},
`;
      
    const component = getFileContent(host, filePath);
    host.overwrite(filePath, component.replace(`const routes: Routes = [`, `const routes: Routes = [${toAdd}`));

    // Add import to routing
    const content = 
`
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ProfileComponent } from './profile/profile.component';
import { GuardService } from 'cap-authentication-forked';
`;
    appendToStartFile(host, filePath, content);

    return host;
  };
}

export default function (options: SchemaOptions): Rule {
  return (host: Tree, context: FileSystemSchematicContext) => {

    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);
    if (!project) {
      throw new SchematicsException(`Project is not defined in this workspace.`);
    }

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }
    options.module = findModule(host, options.path, 'app' + MODULE_EXT, ROUTING_MODULE_EXT);
    options.name = '';
    const parsedPath = parseName(options.path!, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    // Get Index
    if (!options.project) {
      throw new SchematicsException('Option "project" is required.');
    }

    const projectType: string = project.projectType || project.projects[options.project].projectType;
    if (projectType !== 'application') {
      throw new SchematicsException(`Is required a project type of "application".`);
    }

    // Object that will be used as context for the EJS templates.
    const baseTemplateContext = {
      ...strings,
      ...options,
    };

    const templateSource = apply(url('./files'), [
      template(baseTemplateContext),
      move(null as any, parsedPath.path),
      forEach((fileEntry: FileEntry) => {
        if (host.exists(fileEntry.path)) {
          host.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      })
    ]);

    function addPackageJsonDependencies(): Rule {
      return (host: Tree, context: SchematicContext) => {
        const dependencies: NodeDependency[] = [
          { type: NodeDependencyType.Default, version: '^1.0.3', name: 'cap-authentication-forked' },
          { type: NodeDependencyType.Default, version: '^3.0.1', name: '@auth0/angular-jwt' }
        ];
        dependencies.forEach(dependency => {
          addPackageJsonDependency(host, dependency);
          context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
      };
    }

    function installPackageJsonDependencies(): Rule {
      return (host: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask());
        context.logger.log('info', `🔍 Installing packages...`);
        return host;
      };
    }

    return chain([
      branchAndMerge(chain([
        addAuthRoutes(),
        addPackageJsonDependencies(),
        installPackageJsonDependencies(),
        addToNgModule(options),
        mergeWith(templateSource)
      ])),
    ])(host, context);
  };
}

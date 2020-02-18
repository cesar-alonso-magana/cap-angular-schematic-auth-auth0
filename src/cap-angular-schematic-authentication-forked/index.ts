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
  findModule, 
  MODULE_EXT, 
  ROUTING_MODULE_EXT
} from '@schematics/angular/utility/find-module';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { getProjectFromWorkspace } from '@angular/cdk/schematics/utils/get-project';
import {
  addImportToModule
 } from './vendored-ast-utils';
import { Schema as SchemaOptions } from './schema';
import * as ts from 'typescript';
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
    // Import CapAuthenticationModule and declare
    let source = readIntoSourceFile(host, modulePath);

    const componentPath = `${options.path}/app/modules/cap-authentication/cap-authentication.module`;
    const relativePath = componentPath;
    const classifiedName = 'CapAuthenticationModule';
    const importRecorder = host.beginUpdate(modulePath);
    const importChanges: any = addImportToModule(
        source,
        modulePath,
        classifiedName,
        relativePath);

    for (const change of importChanges) {
        if (change instanceof InsertChange) {
          importRecorder.insertLeft(change.pos, change.toAdd);
        }
    }
    host.commitUpdate(importRecorder);

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
          // Here can depend install a auth0 or Firebase or else other module of cap authentication
          { type: NodeDependencyType.Default, version: '^1.0.3', name: 'cap-authentication-forked' }, // forked just for test, real is for cap-authentication for auth0
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
        addPackageJsonDependencies(),
        installPackageJsonDependencies(),
        addToNgModule(options),
        mergeWith(templateSource)
      ])),
    ])(host, context);
  };
}

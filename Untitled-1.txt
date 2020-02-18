import {
  apply,
  MergeStrategy,
  mergeWith,
  Rule,
  move,
  SchematicContext,
  Tree,
  template,
  url,
  chain,
  noop,
  forEach,
  FileEntry,
  SchematicsException,
} from '@angular-devkit/schematics';

import {
  addPackageJsonDependency,
  getWorkspace,
  NodeDependency,
  NodeDependencyType,
  getProjectFromWorkspace,
  getAppModulePath,
  WorkspaceProject,
  addImportToModule,
  // findPropertyInAstObject,
  // findModule,
  // removePropertyInAstObject,
  // InsertChange,
} from 'schematics-utilities';

import { getProjectMainFile, getSourceFile, } from 'schematics-utilities/dist/cdk';
import { normalize, join } from 'path';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export default function (options: any): Rule {
  return chain([
    options && options.skipModuleImport ? noop() : capAngularSchematicAuthAuth0(options),
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
  ]);
}

export function setupOptions(host: Tree, options: any)  {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];
  options.path = join(normalize(project.root), 'src/app/modules/cap-auth');

  return host;
}

export function capAngularSchematicAuthAuth0(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);

    const movePath = normalize('src/app/modules/cap-auth');
    const templateSource = apply(url('./files'), [
      template({
          ..._options
          }),
      move(movePath),
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      }),
    ]);
    const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    return rule(tree, _context);
  };
}
export function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '^1.0.7', name: 'cap-authentication' },
      { type: NodeDependencyType.Default, version: '^3.0.1', name: '@auth0/angular-jwt' },
      { type: NodeDependencyType.Default, version: '^4.3.1', name: 'bootstrap' },
      { type: NodeDependencyType.Default, version: '^3.3.3', name: 'uuid' }
    ];
    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });
    return host;
  };
}

export function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);
    return host;
  };
}

function addModuleToImports (options: any): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    let project : WorkspaceProject = getProjectFromWorkspace(workspace, options.project);
    const moduleName = 'CapAuthModule';
    const modulePath = getAppModulePath(host, getProjectMainFile(project));
    auxAddModuleRoorToImports(host, modulePath, moduleName, './modules/cap-auth/cap-auth.module');
    return host;
  };
}

export function auxAddModuleRoorToImports (host: Tree, modulePath: string, moduleName: string, src: string) {
  const moduleSource = getSourceFile(host, modulePath);

  if (!moduleSource) {
    throw new SchematicsException(`Module not found: ${modulePath}`);
  }

  const changes = addImportToModule(moduleSource as any, modulePath, moduleName, src);
  let recorder = host.beginUpdate(modulePath);
  changes.forEach((change:any) => {
    // if (change instanceof InsertChange) {
      if (change.toAdd) {
        // if (change.toAdd === ',\n    CapAuthModule') {
        //   change.toAdd = `,\n    CapAuthModule.forRoot({clientId: '${options.clientID}', domain: '${options.domain}', clientSecret: '${options.clientSecret}'})`;
        // }
        recorder.insertLeft(change.pos, change.toAdd);
      }
    // }
  });
  host.commitUpdate(recorder);
  return host
}

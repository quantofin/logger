/* eslint-disable no-unused-vars,no-console */
const fs = require('fs');
const path = require('path');
const Docker = require('dockerode');

function isImage(image) {
  return ['.gif', '.jpg', '.jpeg', '.png'].indexOf(path.parse(image).ext) !== -1;
}

function diagramToMarkdown(diagrams) {
  return diagrams
    .map((image) => {
      const { name, base } = path.parse(image);
      return `![${name}](diagrams/${base})`;
    })
    .join('\n');
}

async function generateDocs(config, documentation) {
  const { PACKAGE_NAME, PACKAGE_VERSION, MODULE_PATH } = config;
  // Template for README Markdown
  const template = fs.readFileSync(path.join(__dirname, 'readme-template.md'), 'utf8');

  documentation
    .build(path.join(MODULE_PATH, 'src', 'main.mjs'), {
      access: ['public'],
      projectName: PACKAGE_NAME,
      projectVersion: PACKAGE_VERSION,
    })
    .then(documentation.formats.md)
    .then((markdown) => {
      const readme = `# ${PACKAGE_NAME}\n\n${template
        .replace(/{PACKAGE_NAME}/g, PACKAGE_NAME)
        .replace(/{PACKAGE_VERSION}/g, PACKAGE_VERSION)}\n\n${markdown}`;
      fs.writeFileSync(path.join(MODULE_PATH, 'README.md'), readme);
    })
    .catch((error) => console.error(error));

  documentation
    .build(path.join(MODULE_PATH, 'src', 'main.mjs'), {
      access: ['public'],
      'project-name': PACKAGE_NAME,
      'project-version': PACKAGE_VERSION,
    })
    .then((comments) =>
      documentation.formats.html(comments, {
        'project-name': PACKAGE_NAME,
        'project-version': PACKAGE_VERSION,
        // theme: 'node_modules/node-mapnik-theme',
      })
    )
    .then((files) => {
      const outputPath = path.join(MODULE_PATH, 'dist', 'docs');
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      files.forEach((file) => {
        const filePath = path.join(outputPath, file.relative);
        if (file.isDirectory()) {
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
          }
        } else {
          fs.writeFileSync(filePath, file.contents);
        }
      });
    })
    .catch((error) => console.error(error));
}

async function generateDockerComposeFile(config) {
  const { DOCKER_ORG_NAME, PACKAGE_NAME, PACKAGE_VERSION, MODULE_PATH } = config;

  const template = fs.readFileSync(path.join(__dirname, 'docker-compose-template.yml'), 'utf8');
  const dockerCompose = `${template
    .replace(/{DOCKER_ORG_NAME}/g, DOCKER_ORG_NAME)
    .replace(/{PACKAGE_NAME}/g, PACKAGE_NAME.split('/')[1])
    .replace(/{PACKAGE_VERSION}/g, PACKAGE_VERSION)}`;
  fs.writeFileSync(path.join(MODULE_PATH, 'docker-compose.yml'), dockerCompose);
}

async function generateDockerImage(config) {
  const { DOCKER_ORG_NAME, PACKAGE_NAME, PACKAGE_VERSION, MODULE_PATH } = config;
  const docker = new Docker();
  const imageTag = `${DOCKER_ORG_NAME}/${PACKAGE_NAME.split('/')[1]}:${PACKAGE_VERSION}`;

  return new Promise(async (resolve, reject) => {
    try {
      console.log('Pruning images...');
      await docker.pruneImages();

      console.log(`Building image: ${imageTag}`);
      const stream = await docker.buildImage({ context: path.join(__dirname, '..') }, { t: imageTag });

      stream.on('data', (d) => {
        const lines = d
          .toString('utf8')
          .replace(/\\n/g, '')
          .split('\n');
        lines.forEach((line) => {
          if (line.trim().length > 0) {
            const l = JSON.parse(line);
            console.log(l.stream || l.aux || '');
          }
        });
      });
      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  generateDocs,
  generateDockerComposeFile,
  generateDockerImage,
};

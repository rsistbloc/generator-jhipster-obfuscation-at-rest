const chalk = require('chalk');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    // do something when argument is 'default'
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster obfuscation-at-rest')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            },
            checkDBType() {
                if (this.jhipsterAppConfig.databaseType !== 'sql') {
                    this.env.error(`${chalk.red.bold('ERROR!')} I support only SQL databases...\n`);
                }
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(`\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
                }
            }
        };
    }

    writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaTemplateDir = 'src/main/java/package';
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

        this.template(`${javaTemplateDir}/config/obfuscation/_StringObfuscation.java`, `${javaDir}config/obfuscation/StringObfuscation.java`);
        this.template(`${javaTemplateDir}/config/obfuscation/_LocalDateObfuscation.java`, `${javaDir}config/obfuscation/LocalDateObfuscation.java`);
        this.template(`${javaTemplateDir}/config/obfuscation/_IntegerObfuscation.java`, `${javaDir}config/obfuscation/IntegerObfuscation.java`);

        /* // add required third party dependencies
        if (this.buildTool === 'maven') {
            if (this.databaseType === 'mongodb') {
              this.addMavenDependency('org.javers', 'javers-spring-boot-starter-mongo', '3.5.0', '<scope>compile</scope>');
              this.addMavenDependency('org.mongodb', 'mongo-java-driver', '3.4.2', '<scope>compile</scope>');
            } else if (this.databaseType === 'sql') {
              this.addMavenDependency('org.javers', 'javers-spring-boot-starter-sql', '3.5.0', '<scope>compile</scope>');
            }
          } else if (this.buildTool === 'gradle') {
            if (this.databaseType === 'mongodb') {
              this.addGradleDependency('compile', 'org.javers', 'javers-spring-boot-starter-mongo', '3.5.0');
              this.addGradleDependency('compile', 'org.mongodb', 'mongo-java-driver', '3.4.2');
            } else if (this.databaseType === 'sql') {
              this.addGradleDependency('compile', 'org.javers', 'javers-spring-boot-starter-sql', '3.5.0');
            }
        } */

        // show all variables
        this.log('\n--- some config read from config ---');
        this.log(`baseName=${this.baseName}`);
        this.log(`packageName=${this.packageName}`);
        this.log(`clientFramework=${this.clientFramework}`);
        this.log(`clientPackageManager=${this.clientPackageManager}`);
        this.log(`buildTool=${this.buildTool}`);

        this.log('\n--- some function ---');
        this.log(`angularAppName=${this.angularAppName}`);

        this.log('\n--- some const ---');
        this.log(`javaDir=${javaDir}`);
        this.log(`resourceDir=${resourceDir}`);
        this.log(`webappDir=${webappDir}`);

        this.log('\n--- variables from questions ---');
        this.log(`\nmessage=${this.message}`);
        this.log('------\n');

        try {
            this.registerModule('generator-jhipster-obfuscation-at-rest', 'entity', 'post', 'entity', 'JHipster module for creating data obfuscation at rest with JPA support');
        } catch (err) {
            this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
        }
    }

    install() {
        const logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    }

    end() {
        this.log('End of obfuscation-at-rest generator');
    }
};

const chalk = require('chalk');
const packagejs = require('../../package.json');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const allowedObfuscationTypes = ['String', 'LocalDate', 'Integer'];
const obfuscationConverterTemplate = '<type>Obfuscation';

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            readConfig() {
                this.entityConfig = this.options.entityConfig;
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },
            checkDBType() {
                if (this.jhipsterAppConfig.databaseType !== 'sql') {
                    // exit if DB type is not SQL
                    this.env.error(`${chalk.red.bold('ERROR!')} This sub generator should be used only with SQL db type...\n`);
                }
            },
            displayLogo() {
                this.log(chalk.white(`Running ${chalk.bold('JHipster obfuscation-at-rest')} Generator! ${chalk.yellow(`v${packagejs.version}`)}`));
                this.log(chalk.white(`        Supported types ${JSON.stringify(allowedObfuscationTypes)}\n`));
            },
            validate() {
                // this shouldn't be run directly
                if (!this.entityConfig) {
                    this.env.error(`${chalk.red.bold('ERROR!')} This sub generator should be used only from JHipster and cannot be run directly...\n`);
                }
            }
        };
    }

    prompting() {
        const done = this.async();
        const entityName = this.entityConfig.entityClass;
        const opts = [];

        this.entityConfig.fields.forEach((element) => {
            if (allowedObfuscationTypes.includes(element.fieldType)) {
                opts.push({
                    name: `${element.fieldNameHumanized}`,
                    value: `${element.fieldType}%%%${element.fieldName}`
                });
            }
        });
        const prompts = [
            {
                type: 'confirm',
                name: 'enableObfuscation',
                message: `Do you want to enable the obfuscation for this entity(${entityName})?`,
                default: false
            },
            {
                when: response => (response.enableObfuscation && this.entityConfig.fields && this.entityConfig.fields.length > 0),
                type: 'checkbox',
                name: 'fieldsToObfuscate',
                message: 'Which fields do you want to obfuscate?',
                choices: opts
            }
        ];

        this.prompt(prompts).then((props) => {
            this.props = props;
            done();
        });
    }

    get writing() {
        return {
            updateFiles() {
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
                const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
                const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
                const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

                const entityName = this.entityConfig.entityClass;

                // show all variables
                this.log('\n--- some const ---');
                this.log(`javaDir=${javaDir}`);
                this.log(`resourceDir=${resourceDir}`);
                this.log(`webappDir=${webappDir}`);

                this.log('\n--- entityName ---');
                this.log(`\nentityName=${entityName}`);

                this.log('------\n');

                if (this.props.fieldsToObfuscate && this.props.fieldsToObfuscate.length > 0) {
                    const entityPath = `${javaDir}domain/${this.entityConfig.entityClass}.java`;
                    this.props.fieldsToObfuscate.forEach((element) => {
                        // split the element by before pattern used '%%%'
                        const field = element.split('%%%');

                        // retrieve the converter fqn.classname.class java Converter by naming convention <type>Obfuscation
                        // into the config.obfuscation package
                        const converter = `${this.packageName}.config.obfuscation.${obfuscationConverterTemplate.replace('<type>', field[0])}`;

                        /**
                        * - @javax.persistence.Convert\\(.*\\))? is there to remove any previous @javax.persistence.Convert tag
                        * - (\\s*) is there to catch the indentation
                        * - field[0] is the field type
                        * - field[1] is the field name
                        * - (private ${field[0]} ${field[1]};) is the marker we use to know where to insert the new @Convert tag.
                        */
                        this.replaceContent(entityPath, `(@Convert\\(.*\\))?(\\s*)(private ${field[0]} ${field[1]};)`, `$2@Convert(converter = ${converter}.class)$2$3`, true);
                    });
                }
            },

            writeFiles() {
                // function to use directly template
                this.template = function (source, destination) {
                    this.fs.copyTpl(
                        this.templatePath(source),
                        this.destinationPath(destination),
                        this
                    );
                };

                // this.template('dummy.txt', 'dummy.txt', this, {});
            },

            updateConfig() {
                this.log(this.entityConfig.filename);
                this.updateEntityConfig(this.entityConfig.filename, 'obfuscationAtRest', this.props.fieldsToObfuscate);
            }
        };
    }

    end() {
        if (this.props.fieldsToObfuscate) {
            let fields = '';
            let i = 1;
            this.props.fieldsToObfuscate.forEach((element) => {
                const field = element.split('%%%');
                fields += `\n       #${i++} - ${field[1]} `;
            });
            this.log(`\n${chalk.bold.green('Obfuscation enabled on field: ')}${fields}`);
        }
    }
};

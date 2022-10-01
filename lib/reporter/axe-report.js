const CliTable = require('cli-table3');

const Utils = require('../utils');
const {Logger} = Utils;


const describeViolations = (violations) => {
  const aggregate = {};

  violations.map(({nodes}, index) => {
    nodes.forEach(({target, html}) => {
      const key = JSON.stringify(target) + html;

      if (aggregate[key]) {
        aggregate[key].violations.push(index);
      } else {
        aggregate[key] = {
          target: JSON.stringify(target),
          html,
          index: [index]
        };
      }
    });
  });

  return Object.values(aggregate).map(({target, html, violations}) => {
    return {target, html, violations: JSON.stringify(violations)};
  });
};

module.exports = class AxeReport {

  static createTable() {
    const table = new CliTable({
      chars: {
        'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '',
        'bottom': '═' , 'bottom-mid': '' , 'bottom-left': '╚' , 'bottom-right': '╝'
      }
    });
    table.push(
      [
        Logger.colors.light_cyan('ID'),
        Logger.colors.light_cyan('Impact'),
        Logger.colors.light_cyan('Description'),
        Logger.colors.light_cyan('Nodes')
      ],
      [
        Logger.colors.stack_trace('─────────────────────'),
        Logger.colors.stack_trace('──────────'), '',
        Logger.colors.stack_trace('──────────')
      ]
    );

    return table;
  }

  constructor(report, {detailedReport = true, includeHtml = true} = {}) {
    this.report = report;
    this.detailedReport = detailedReport;
    this.includeHtml = includeHtml;
  }

  hasViolations() {
    return this.report.violations.length > 0;
  }

  printPasses() {
    const table = AxeReport.createTable();
    const {passes} = this.report;
    passes.forEach(({id, impact, description, nodes}) => {
      table.push([id, impact, description, nodes.length]);
    });

    console.log(table.toString());
  }

  printViolations() {
    const {violations} = this.report;

    console.log('\n' + Logger.colors.green(`Accessibility report for: ${this.report.component}`));

    const table = AxeReport.createTable();

    violations.forEach(({id, impact, description, nodes}) => {
      table.push([id, impact, description, nodes.length]);
    });

    // summary
    if (this.detailedReport) {
      const nodeViolations = describeViolations(violations).map(({target, html, violations}) => {
        if (!this.includeHtml) {
          return {
            target,
            violations
          };
        }

        return {target, html, violations};
      });

      table.push(
        [
          Logger.colors.stack_trace('─────────────────────'),
          Logger.colors.stack_trace('──────────'), '',
          Logger.colors.stack_trace('──────────')
        ],
        [{colSpan: 2, content: Logger.colors.light_cyan('Target')}, Logger.colors.light_cyan('Html'), Logger.colors.light_cyan('Violations')]
      );

      nodeViolations.forEach(({target, html, violations}) => {
        table.push(
          [{colSpan: 2, content: target}, Logger.colors.stack_trace(html), violations]
        );
      });
      table.push([
        {colSpan: 4, content: ''}
      ]);
    }
    console.log(table.toString());
  }
}
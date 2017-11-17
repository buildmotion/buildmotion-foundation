export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/buildmotion-foundation.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'buildmotion-foundation',
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/http': 'ng.http',
		'@angular/router': 'ng.router',
		'rxjs/Observable': 'Rx',
		'angular-rules-engine': 'angularRulesEngine',
		'angular-rules-engine/validation/ValidationContext': 'angularRulesEngine.validation.prototype',
		'angular-rules-engine/service/ServiceMessage': 'angularRulesEngine.service.prototype',
		'angular-rules-engine/service/MessageType': 'angularRulesEngine.service.prototype',
		'angular-rules-engine/service/ServiceContext': 'angularRulesEngine.service.prototype',
		'angular-rules-engine/rules/CompositeRule': 'angularRulesEngine.rules.prototype',
		'angular-rules-engine/rules/RuleResult': 'angularRulesEngine.rules.prototype',
	}
}
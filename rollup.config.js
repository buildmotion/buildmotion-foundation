export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/buildmotion-foundation.umd.js',
	sourceMap: true,
	format: 'umd',
	moduleName: 'buildmotionFoundation',
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/http': 'ng.http',
		'rxjs': 'Rx',
		'rxjs/Rx': 'Rx',
		'rxjs/Rx/BehaviorSubject': 'Rx.BehaviorSubject.prototype',
		'rxjs/observable': 'Rx.Observable.prototype',
		'angular-rules-engine': 'angularRulesEngine',
		'angular-actions': 'angularActions',
		'buildmotion-logging': 'buildmotionLogging',
		'buildmotion-logging/severity.enum': 'buildmotionLogging/Severity',
		'buildmotion-logging/logging.service': 'buildmotionLogging/LoggingService'
	}
}

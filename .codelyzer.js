module.exports = {
    //fix for https://github.com/mgechev/codelyzer/issues/189
    predefinedDirectives: [
        {selector: 'input', exportAs: 'ngbDatepicker'},
        {selector: 'form', exportAs: 'ngForm'},
        {selector: '[ngbTooltip]', exportAs: 'ngbTooltip'}
    ]
};

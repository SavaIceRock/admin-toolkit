/* Copyright (c) 2020 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */
import React, { useCallback, useRef, useState, useEffect, } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { observer } from 'mobx-react';
var EntityFieldReferenceSelect = observer(function (_a) {
    var label = _a.label, value = _a.value, handler = _a.handler, error = _a.error, isEditing = _a.isEditing, onClick = _a.onClick, options = _a.options;
    var ref = useRef(null);
    var onChange = useCallback(function (event) {
        if (!handler)
            return;
        handler(event.target.value);
    }, [value, handler]);
    var _b = useState(0), labelWidth = _b[0], setLabelWidth = _b[1];
    useEffect(function () {
        setLabelWidth((ref.current && ref.current.clientWidth) || 0);
    }, [ref.current]);
    return isEditing ? (React.createElement(FormControl, { variant: "outlined" },
        React.createElement(InputLabel, { htmlFor: label, style: { whiteSpace: 'nowrap' }, ref: ref }, label),
        React.createElement(Select, { variant: "outlined", id: label, name: label, label: label, value: !value ? '' : value, onChange: onChange, error: !!error, inputProps: { className: 'select' }, labelWidth: labelWidth, style: { minWidth: labelWidth + 40 } },
            React.createElement(MenuItem, { value: "" }, "..."),
            options &&
                options.referenceData &&
                Object.keys(options.referenceData).map(function (item) { return (React.createElement(MenuItem, { key: item, value: item }, options.referenceData[item])); })))) : (React.createElement("div", { onClick: onClick }, (options && options.referenceData && options.referenceData[value]) || (React.createElement("div", null, "\u00A0"))));
});
export { EntityFieldReferenceSelect };
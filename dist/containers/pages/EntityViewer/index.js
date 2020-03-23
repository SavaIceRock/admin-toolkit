/* Copyright (c) 2020 IceRock MAG Inc. Use of this source code is governed by the Apache 2.0 license. */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useMemo, createElement, useState, useCallback } from 'react';
import { Breadcrumbs, Typography, withStyles, Link, Paper, Grid, Button, } from '@material-ui/core';
import styles from './styles';
import { getEntityFieldRenderer } from '../../../types/entity';
import { observer } from 'mobx-react';
import { Link as RouterLink } from 'react-router-dom';
import { toJS } from 'mobx';
var EntityViewer = withStyles(styles)(observer(function (_a) {
    var classes = _a.classes, entities = _a.entities, id = _a.id, fields = _a.fields, url = _a.url, isEditing = _a.isEditing, entityName = _a.entityName, onSave = _a.onSave;
    var isCreating = useMemo(function () { return typeof id === 'undefined'; }, [id]);
    var entity = useMemo(function () {
        return isCreating
            ? {}
            : entities.find(function (entry) { return String(entry.id) === String(id); }) || {};
    }, [entities, id]);
    var title = useMemo(function () {
        var field = fields.find(function (f) { return f.title; });
        return entity && field && field.name ? entity[field.name] : id;
    }, [entity, fields, id]);
    var _b = useState(toJS(entity)), data = _b[0], setData = _b[1];
    var onFieldChange = useCallback(function (f) { return function (value) {
        var _a;
        return setData(__assign(__assign({}, data), (_a = {}, _a[f] = value, _a)));
    }; }, [data, setData]);
    var onSubmit = useCallback(function (event) {
        event.preventDefault();
        onSave(data);
    }, [onSave, data]);
    return (React.createElement("div", { className: classes.wrap },
        React.createElement("div", { className: classes.breadcrumbs },
            React.createElement(Grid, { container: true, alignItems: "center" },
                React.createElement(Grid, { style: { flex: 1 } },
                    React.createElement(Breadcrumbs, { "aria-label": "breadcrumb" },
                        entityName && (React.createElement(Link, { color: "inherit", to: url, component: RouterLink }, entityName)),
                        isEditing && !isCreating && (React.createElement(Link, { color: "inherit", to: url + "/" + id, component: RouterLink }, title)),
                        !isEditing && !isCreating && (React.createElement(Typography, { color: "textPrimary" }, title)),
                        isEditing && !isCreating && (React.createElement(Typography, { color: "textPrimary" }, "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435")),
                        isEditing && isCreating && (React.createElement(Typography, { color: "textPrimary" }, "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435")))),
                !isEditing && (React.createElement(Button, { to: url + "/" + id + "/edit", component: RouterLink, variant: "contained", color: "primary", type: "button" }, "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C")))),
        data && (React.createElement("form", { onSubmit: onSubmit },
            React.createElement(Paper, null,
                fields.map(function (field) { return (React.createElement("div", { className: classes.field, key: field.name },
                    React.createElement("div", { className: "label" }, field.label || field.name),
                    React.createElement("div", { className: "field" }, createElement(getEntityFieldRenderer(field.type || typeof data[field.name]), {
                        value: Object.prototype.hasOwnProperty.call(data, field.name)
                            ? data[field.name]
                            : null,
                        isEditing: isEditing,
                        handler: onFieldChange(field.name),
                    })))); }),
                isEditing && (React.createElement("div", { className: classes.field },
                    React.createElement(Grid, { container: true, spacing: 1 },
                        React.createElement(Grid, { item: true, style: { flex: 1 } }),
                        React.createElement(Grid, { item: true },
                            React.createElement(Button, { type: "submit", color: "default", variant: "outlined", to: isCreating ? url : url + "/" + id, component: RouterLink }, "\u041E\u0442\u043C\u0435\u043D\u0430")),
                        React.createElement(Grid, { item: true },
                            React.createElement(Button, { type: "submit", variant: "contained", color: "primary" }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"))))))))));
}));
export { EntityViewer };

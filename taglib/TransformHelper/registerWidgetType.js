/*
 * Copyright 2011 eBay Software Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function registerWidgetType(target) {
    var template = this.template;
    var compiler = this.compiler;

    var typePathExpression;
    var targetExpression;

    template.addStaticVar('__getDynamicClientWidgetPath', 'require("' + this.getMarkoWidgetsRequirePath('marko-widgets/taglib/helpers/getDynamicClientWidgetPath') + '")');

    if (compiler.hasExpression(target)) {
        return '__getDynamicClientWidgetPath(' + compiler.convertType(target, 'string', true) + ')';
    }

    // Resolve the static string to a full path at compile time
    typePathExpression = template.addStaticVar(
        target,
        JSON.stringify(this.getClientWidgetPath(target)));

    targetExpression = 'require(' + JSON.stringify(target) + ')';

    var widgetTypes = template.data.widgetTypes;

    if (!widgetTypes) {
        template.data.widgetTypes = widgetTypes = [];

        var registerWidgetNode = compiler.createNode('w-register-widget', {
            widgetTypes: widgetTypes
        });

        template.rootNode.insertBefore(registerWidgetNode, template.rootNode.firstChild);
    }

    widgetTypes.push({
        name: typePathExpression,
        target: targetExpression
    });

    return typePathExpression;
}

module.exports = registerWidgetType;
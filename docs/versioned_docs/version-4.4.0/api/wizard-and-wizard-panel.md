---
id: wizard-and-wizard-panel
title: Wizard and Wizard panel
---

## Introduction

A **wizard** or **assistant** is a very useful screen component to guide the user through an ordered group of screens called *steps*:

<img alt="Wizard" src={require('@docusaurus/useBaseUrl').default('img/Wizard.png')} />

## XML skeleton

The wizard structure is very similar to [tab and tabcontainer](tab-and-tabcontainer.md) structure:

```xml
<wizard id="[wizard-identifier]" initial-load="[initial-load]" target-action="[target-action]" label="[wizard-step-label]">
  <wizard-panel id="[panel-identifier]">
     ...
  </wizard-panel>
  <wizard-panel id="[panel-identifier]">
     ...
  </wizard-panel>
  ...
</wizard>
```

## Wizard structure

```xml
<wizard id="[wizard-identifier]" initial-load="[initial-load]" target-action="[target-action]" label="[wizard-step-label]">
   ...
</wizard>
```

### Wizard attributes

| Attribute   | Use          | Type      |  Description                |   Values                                           |
| ----------- | ------------ |-----------|-----------------------------|----------------------------------------------------|
| id          | **Required** | String    | Wizard identifier. For reference purposes |                                   |
| label       | Optional     | String    | Wizard step text (without the number) | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| style       | Optional     | String    | Wizard CSS classes       |   |
| initial-load | Optional   | String    | Server action call to load the wizard steps (launched at window generation) | `enum` (for [enumerated](enumerate-definition.md)), `query` (for [query call](query-definition.md)) |
| target-action | Optional   | String    | Target to call on the server|                                                    |
| size        | Optional     | String    | Wizard size              | `sm` (default), `md` or `lg`.                      |
| help        | Optional     | String    | Help text for the criterion | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| help-image  | Optional     | String    | Help image for the criterion | This **must** be a image path |

## Wizard panel structure

```xml
<wizard-panel id="[panel-identifier]">
  ...
</wizard-panel>
```

### Wizard panel attributes

| Attribute   | Use          | Type      |  Description                |   Values                                           |
| ----------- | ------------ |-----------|-----------------------------|----------------------------------------------------|
| id          | **Required** | String    | Panel identifier. Must be the same as target values |                                   |
| style       | Optional     | String    | Panel CSS classes       |   |
| help        | Optional     | String    | Help text for the criterion | **Note:** You can use [i18n](i18n-internationalization.md) files (locales) |
| help-image  | Optional     | String    | Help image for the criterion | This **must** be a image path |

## Examples

* **Wizard with 4 steps and validation in each step**

```xml
<wizard id="wizardTest" initial-load="enum" target-action="WizTst" label="SCREEN_TEXT_STEP">
  <wizard-panel id="WizardStep1">
    <tag type="div" style="fullHeight" expandible="vertical">
      <tag type="div" style="panel-body expand">
        ...
      </tag>
      <tag type="div" style="panel-footer">
        <tag type="div" style="pull-right">
          <button label="BUTTON_NEXT" icon="chevron-circle-right" id="FwStep2" style="btn-primary">
            <button-action type="validate" target="WizardStep1"/>
            <button-action type="next-step" target="wizardTest"/>
          </button>
        </tag>
      </tag>
    </tag>
  </wizard-panel>
  <wizard-panel id="WizardStep2">
    <tag type="div" style="fullHeight" expandible="vertical">
      <tag type="div" style="panel-body expand">
        ...
      </tag>
      <tag type="div" style="panel-footer">
        <tag type="div" style="pull-right">
          <button label="BUTTON_PREVIOUS" icon="chevron-circle-left" id="BkStep1">
            <button-action type="prev-step" target="wizardTest"/>
          </button>
          <button label="BUTTON_NEXT" icon="chevron-circle-right" id="FwStep3" style="btn-primary">
            <button-action type="validate" target="WizardStep2"/>
            <button-action type="next-step" target="wizardTest"/>
          </button>
        </tag>
      </tag>
    </tag>
  </wizard-panel>
  <wizard-panel id="WizardStep3">
    <tag type="div" style="fullHeight" expandible="vertical">
      <tag type="div" style="panel-body expand">
        ...
      </tag>
      <tag type="div" style="panel-footer">
        <tag type="div" style="pull-right">
          <button label="BUTTON_PREVIOUS" icon="chevron-circle-left" id="BkStep2">
            <button-action type="prev-step" target="wizardTest"/>
          </button>
          <button label="BUTTON_NEXT" icon="chevron-circle-right" id="FwStep4" style="btn-primary">
            <button-action type="validate" target="WizardStep3"/>
            <button-action type="next-step" target="wizardTest"/> 
          </button>
        </tag>
      </tag>
    </tag>
  </wizard-panel>
  <wizard-panel id="WizardStep4">
    <tag type="div" style="fullHeight" expandible="vertical">
      <tag type="div" style="panel-body expand">
        ...
      </tag>
      <tag type="div" style="panel-footer">
        <tag type="div" style="pull-right">
          <button label="BUTTON_PREVIOUS" icon="chevron-circle-left" id="BkStep3">
            <button-action type="prev-step" target="wizardTest"/>
          </button>
          <button label="BUTTON_FINISH" icon="check" id="Finish" style="btn-primary">
            <button-action type="validate" target="WizardStep4"/>
          </button>
        </tag>
      </tag>
    </tag>
  </wizard-panel>
</wizard>
```

Which will generate the following wizard:

<img alt="Wizard" src={require('@docusaurus/useBaseUrl').default('img/Wizard.png')} />
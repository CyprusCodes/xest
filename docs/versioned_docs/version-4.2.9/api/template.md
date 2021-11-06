---
id: template
title: Template
---

A template is a JSP file which contains a link between the AWE engine and the *XML descriptor*. Those links are called **source points**. Each JSP template has *one or more source points*. These *source points* are the places where our generated code in the *XML descriptor* will be located once each page is generated.

To set contains of a tag into a source, just fill the source attribute of the tag with the name of the source (i.e. `<tag source="center">`).

Currently AWE has 2 standard templates defined with their sources:
* **full**: For full screen windows. Contains the following sources:
  * *center:* Window center container. Place to define the screen structure.
  * *hidden:* Hidden container for hidden criteria and messages.
* **window**: Template for inner application windows inside a full template view. It has the next sources:
  * *buttons:* Source to place buttons in the upper right zone of the screen.
  * *center:* Window center container. Place to define the screen structure.
  * *modal:* Source to place *includes* with modal windows.
  * *hidden:* Hidden container for hidden criteria and messages.



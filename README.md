# Acrolinx Sidebar Interface

This project contains the [Acrolinx Sidebar Interface documentation](https://acrolinx.github.io/sidebar-interface/)
generated from its [TypeScript source](./src/index.ts).

For the most use cases you don't have to use the Acrolinx Sidebar Interface directly, but can use instead the [Acrolinx SDKs](https://github.com/acrolinx?q=sdk).

## Live Demo

[Acrolinx Sidebar Web Live Demo](https://acrolinx.github.io/acrolinx-sidebar-demo/samples/index.html)

## The Acrolinx Sidebar

The Acrolinx Sidebar is designed to show up beside the window where you edit your content.
You use it for checking, reviewing, and correcting your content.
To get an impression what the Sidebar looks like in existing integrations, have a look at
[Sidebar Quick Start](https://support.acrolinx.com/hc/en-us/articles/10252588984594-Sidebar-Quick-Start).

## Prerequisites

Please contact [Acrolinx SDK support](https://github.com/acrolinx/acrolinx-coding-guidance/blob/main/topics/sdk-support.md)
for consulting and getting your integration certified.
This sample works with a test license on an internal Acrolinx URL.
This license is only meant for demonstration and developing purposes.
Once you finished your integration, you'll have to get a license for your integration from Acrolinx.

Acrolinx offers different other SDKs, and examples for developing integrations.

Before you start developing your own integration, you might benefit from looking into:

- [Build With Acrolinx](https://support.acrolinx.com/hc/en-us/categories/10209837818770-Build-With-Acrolinx),
- the [Guidance for the Development of Acrolinx Integrations](https://github.com/acrolinx/acrolinx-coding-guidance),
- the [Acrolinx SDKs](https://github.com/acrolinx?q=sdk), and
- the [Acrolinx Demo Projects](https://github.com/acrolinx?q=demo).

### Installation Via NPM

For the most use cases you don't have to use the Acrolinx Sidebar Interface directly,
but can use instead the [Acrolinx Sidebar JavaScript SDK](https://github.com/acrolinx/sidebar-sdk-js).

```bash
npm install @acrolinx/sidebar-interface
```

## (Internal Only) Create a new release

Follow the instruction for [creating a release in Github](https://docs.github.com/en/github/administering-a-repository/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)

1. Make sure you have updated the version number in the package.json.
2. On GitHub, navigate to the main page of the repository.
3. To the right of the list of files, click Releases or Latest release.
4. Click Draft a new release.
5. Type a version number for your release.
6. Use the drop-down menu to select the master branch for the release.
7. Add title and description.
8. If you're ready to publicize your release, click Publish release.
9. Github Workflow will take care of publishing the new version to npm.

## License

Copyright 2016-present Acrolinx GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

For more information visit: [https://www.acrolinx.com](https://www.acrolinx.com)

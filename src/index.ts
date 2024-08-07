/*
 * Copyright 2016-present Acrolinx GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This document describes the interface of the Acrolinx Sidebar. Batch checking feature is only supported from sidebar version 15.0 and Core Platform version 2021.12.
 *
 * Let's understand how the typical bootstrapping of an integration and the Acrolinx Sidebar works:
 *
 * 1) Load the host editor of your integration.
 *
 * 2) Load your integration code.
 *
 * 3) Register your integration as an AcrolinxPlugin.
 *  ```
 *  var acrolinxPlugin = {...}
 *  ```
 *  Check the {@link AcrolinxPlugin} interface for required methods, that you need to implement.
 *
 * 4) Load the sidebar and the referenced libraries code (usually sidebar.js, libs.js, sidebar.css).
 *
 * 5) Once the sidebar has finished loading it will request the integration to initialize by calling
 *    {@link AcrolinxPlugin.requestInit|requestInit}.
 *
 * 6) The AcrolinxPlugin now must call {@link AcrolinxSidebar.init|init}.
 *
 * 7) Once the init process has finished, the plug-in will be notified:
 *    {@link AcrolinxPlugin.onInitFinished|onInitFinished}.
 *
 * 8) If the user pushes the button "Check" or "Batch Check", {@link AcrolinxPlugin.requestGlobalCheck|requestGlobalCheck} is called.
 *     In case of a batch check, the flag {@link RequestGlobalCheckOptions.batchCheck|batchCheck} in options is set to true.
 *
 * 9) The acrolinxPlugin must call {@link AcrolinxSidebar.checkGlobal|checkGlobal} to perform a check.
 *    In case of a batch check, the acrolinxPlugin must call  {@link AcrolinxSidebar.initBatchCheck|initBatchCheck} with a list of document identifiers to be checked.
 *
 * 10) When a regular check has finished, {@link AcrolinxPlugin.onCheckResult|onCheckResult} is called and the sidebar displays
 * cards for the issues.
 *
 * 11) If the user clicks a card after a regular check, {@link AcrolinxPlugin.selectRanges|selectRanges} is called
 *
 * 12) When the user selects a replacement after a regular check, {@link AcrolinxPlugin.replaceRanges|replaceRanges} is called.
 *
 * 13) When a batch check is started, the sidebar will request the integration to initiate a check for each document identifier
 *     by calling {@link AcrolinxPlugin.requestCheckForDocumentInBatch|requestCheckForDocumentInBatch}.
 *
 * 14) The acrolinxPlugin must then call {@link AcrolinxSidebar.checkDocumentInBatch|checkDocumentInBatch} to perform a check on a given document.
 *
 * 15) If the user clicks a card after the batch check has started, {@link AcrolinxPlugin.openDocumentInEditor|openDocumentInEditor} is called requesting acrolinxPlugin to open the document.
 *
 * For a minimal integration (not feature complete) you must implement {@link requestInit}, {@link requestGlobalCheck},
 * {@link selectRanges} and {@link replaceRanges}.
 *
 * @packageDocumentation
 */

/**
 * The subset of {@link InitParameters}, that can be reconfigured by {@link AcrolinxSidebar.configure}.
 */
export interface SidebarConfiguration {
  /**
   * This setting will render cards with suggestions in read-only mode. This means the sidebar won't trigger suggestion
   * replacements in the document. The cards will still work for navigation.
   */
  readOnlySuggestions?: boolean;
}

/**
 *
 * @interface InitParameters
 */
export interface InitParameters extends SidebarConfiguration {
  /**
   * These provide information about your integration and other client software components to display them
   * in the sidebars about dialog. In addition they are used for analytics.
   *
   * They should include information about your plugin and can contain additional libraries or components you are using
   * in your integration. For details check {@link SoftwareComponent}.
   */
  clientComponents?: SoftwareComponent[];

  /**
   *
   * The client locale should be equal to or start with "en", "de", "fr", "sv" or "ja". By default it is set to "en".
   * This clientLocale is ignored if the user configures the ui language in the sidebar manually.
   */
  clientLocale?: string;

  /**
   *  The integration specific clientSignature. To get one, ask your Acrolinx contact. It is used to register and
   *  identify your plugin.
   *
   */
  clientSignature?: string;

  /**
   * By default value of this property is ''. That means the base URL of the host that your plugin runs from.
   * If your Acrolinx Server runs on a different host, you have to put the address here.
   */
  serverAddress?: string;

  /**
   * This property enables the user to manually change the serverAddress on the sidebar start page.
   * It's not effective if the Sidebar is loaded directly.
   */
  showServerSelector?: boolean;

  /**
   * With this property you can define check settings that will apply to all triggered checks.
   * This settings will overwrite the saved settings of the user.
   */
  checkSettings?: CheckSettings;

  /**
   * This settings will be used as initial default settings when the user uses the sidebar for the first time.
   * If checkSettings is defined then the defaultCheckSettings will be ignored.
   */
  defaultCheckSettings?: CheckSettings;

  /**
   * This setting will prevent any connection with an Acrolinx Server via other than HTTPS protocol.
   */
  enforceHTTPS?: boolean;

  /**
   * By default, the Sidebar won't send or receive any cookies from the Acrolinx platform for CORS requests,
   * resulting in unauthenticated requests if a proxy between Sidebar and platform relies on maintaining a user session.
   * To send cookies, this option init option must be set to true.
   */
  corsWithCredentials?: boolean;

  /**
   * Path to the log file of the integration.
   * If this property is set, the integration should also support {@link AcrolinxPlugin.openLogFile}.
   */
  logFileLocation?: string;

  /**
   * @deprecated This property isn’t needed anymore, and will be removed in future.
   * This property is only effective if the Sidebar start page is used.
   * It prevents the user to connect to a Sidebar with an lower version.
   * Example values: '14.4.2' or '14.4'
   */
  minimumSidebarVersion?: string;

  /**
   * Extraordinary capabilities of the plugin.
   */
  supported?: {
    checkSelection?: boolean;
    showServerSelector?: boolean;
    supportsBatchChecks?: boolean;
    supportsLive?: boolean;

    /**
     * Tells the Sidebar, that this integration supports AcrolinxPlugin.log
     */
    log?: boolean;
  };

  uiMode?: UiMode;

  /**
   * If the user clicks the help button, the sidebar opens this URL using AcrolinxPlugin.openWindow.
   * If this property is omitted, the sidebar opens the Acrolinx default help.
   */
  helpUrl?: string;

  additionalSecureUrlPrefixes?: string[];

  /**
   * By default, the Sidebar uses {@link AcrolinxPlugin.openWindow} to open new windows.
   * In some web integrations this might trigger the popup blocker.
   * If openWindowDirectly is true, the Sidebar will open new windows directly and thereby circumvent
   * the popup blocker.
   */
  openWindowDirectly?: boolean;

  /**
   * An integration that configures csrfConfig should not at the same time monkey-patch the XMLHttpRequest of the
   * sidebar.
   */
  csrf?: CsrfConfig;

  /**
   * If set to true: auto-advance is disabled and can't be enabled by the user.
   * If set to false: auto-advance is enabled according to the user profile.
   * @default false
   */
  disableAutoAdvanceCard?: boolean;

  /**
   * The sidebar tries to sign in the user with this optional accessToken.
   * The sidebar start page forwards this accessToken to the sidebar only if showServerSelector === false.
   * New since sidebar version 14.11.0.
   */
  accessToken?: string;
}

export type UiMode = 'default' | 'noOptions';

export interface CsrfConfig {
  url: string;
}

/**
 * These are the settings used, when checking text.
 */
export interface CheckSettings {
  profileId: string;
}

/**
 * Provide information about your integration and other client software components for the about dialog and
 * analytics.
 */
export interface SoftwareComponent {
  /**
   * The id of the software component.
   * Examples: 'com.acrolinx.win.word.32bit', 'com.acrolinx.mac.word'
   */
  id: string;

  /**
   * The name if the software component.
   * This name will be displayed in the sidebars about dialog.
   */
  name: string;

  /**
   * The version of the software component.
   * @format: ${major}.${minor}.${patch}.${buildNumber}
   * @example: '1.2.3.574'
   */
  version: string;

  /**
   * Check {@link SoftwareComponentCategory} to choose the right value for your component.
   * By default value this value will be set to 'DEFAULT'.
   * @type SoftwareComponentCategory
   */
  category?: string;
}

export const SoftwareComponentCategory = {
  /**
   * There should be exactly one MAIN component.
   * This information is used to identify your client on the server.
   * Version information about this components might be displayed more prominently.
   */
  MAIN: 'MAIN',

  /**
   * Version information about such components are displayed in the about
   * dialog.
   */
  DEFAULT: 'DEFAULT',

  /**
   * Version information about such components are displayed in the detail section of the about
   * dialog or not at all.
   */
  DETAIL: 'DETAIL',
};

export interface RequestGlobalCheckOptions {
  selection: boolean;
  batchCheck: boolean;
}

export interface BatchCheckRequestOptions {
  documentIdentifier: string;
  displayName: string;
}

/**
 * Check options describe how the server should handle the checked document.
 */
export interface CheckOptions {
  /**
   * Valid formats are:
   * XML, HTML, TEXT, WORD_XML
   */
  inputFormat?: string;

  /**
   * Only supported with Acrolinx Platform 2019.10 (Sidebar version 14.16) and newer.
   */
  externalContent?: ExternalContent;

  requestDescription?: {
    /**
     * Usually the path and file name. In a CMS it could be the id, which can be used to
     * lookup the document.
     */
    documentReference?: string;
  };

  /**
   * Experimental
   */
  selection?: DocumentSelection;
}

export interface DocumentSelection {
  ranges: DocumentRange[];
}

export type DocumentRange = [number, number];

/**
 * Each {@link checkGlobal} call will return an unique id, which helps the plugin to map results,
 * selection, and replacement requests to the corresponding checked document. This is necessary, because the returned
 * offsets are only valid for the document at a specific point in time. All changes made to the document after the
 * check call will make the offsets invalid. That's why you should to store the submitted document contents
 * together with its check ids in a map.
 */
export interface Check {
  checkId: string;
}

export interface ExternalContentField {
  id: string;
  content: string;
}

export interface ExternalContent {
  textReplacements?: ExternalContentField[];
  entities?: ExternalContentField[];
  ditaReferences?: ExternalContentField[];
  xincludeReferences?: ExternalContentField[];
  references?: AugmentedExternalContent[];
}

export interface AugmentedExternalContent {
  type: string;
  value: ExternalContentField[];
}

/**
 * After a check, the sidebar will tell the plug-in which parts of the document had been checked.
 */
export interface CheckResult {
  /**
   * The part of the document which was checked by the server. If the server recognizes that parts of the document
   * are missing, only valid parts will be checked.
   */
  checkedPart: CheckedDocumentPart;

  /**
   * The integration can embed this information into the document or into a separate storage.
   */
  embedCheckInformation?: CheckInformationKeyValuePair[];

  /**
   * Input Format of the document
   */
  inputFormat?: string;
}

/**
 * CheckInformationKeyValuePair has the check information sent by the server.
 */
export interface CheckInformationKeyValuePair {
  /**
   * The id of the check information part.
   */
  key: string;

  /**
   * The value of the check information part.
   */
  value: string;
}

/**
 * CheckedDocumentPart describes a part of a previously checked document. All range offsets are only valid to that
 * specific document belonging that check id.
 */
export interface CheckedDocumentPart {
  /**
   * The id of the check where the document part belongs to.
   */
  checkId: string;

  /**
   * A range are two numbers: A start offset and an end offset.
   */
  range: [number, number];

  externalContent?: ExternalContentMatch[];
}

export type InvalidDocumentPart = CheckedDocumentPart;
export type CheckedDocumentRange = CheckedDocumentPart;

export interface Match {
  content: string;

  /**
   *  A range are two numbers: A start offset and an end offset.
   */
  range: [number, number];

  /**
   * Available since the 5.0 server.
   */
  extractedRange?: [number, number];

  /**
   * Available since the 5.2.1 server.
   */
  locations?: MatchLocation[];

  /**
   * Available since the 2022.05 server.
   */
  externalContentMatches?: ExternalContentMatch[];
}

export interface ExternalContentMatch {
  id: string;
  type: string;
  originalBegin: number;
  originalEnd: number;
  externalContentMatches?: ExternalContentMatch[];
}

export interface MatchLocation {
  type: string;
  title?: string;
  values: { [key: string]: string };
}

/**
 * Content and offsets belonging to a previous performed check, which must be replaced by the replacement.
 * The offsets of the matches are only valid to the unchanged document content, which was originally sent using
 * checkGlobal and can be identified by its check id. The matches are ordered by the offsets in the
 * original document. The matches can be non-continuously. Usually it is a good idea to iterate from the last match
 * to the first match performing the replacement operation. The content of a match could differ from the original
 * document. Usually it is the readable version of what you submitted. For example, entities can be resolved.
 */
export interface MatchWithReplacement extends Match {
  replacement: string;
}

export interface OpenWindowParameters {
  url: string;
}

/**
 * The result of {@link init}, which can contain an error.
 */
export interface InitResult {
  error?: SidebarError;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  integrationProperties?: { [key: string]: any };
}

export interface SidebarError {
  /**
   *  The code which enables the integration to react:
   *
   *  `httpError` : Something went wrong while talking to server
   *  `tokenInvalid` : The token has not been accepted by the server
   *  `argumentPropertyInvalid` : Some argument is invalid, please check your arguments with the interface definition.
   */
  code: string;

  /**
   * Log, read or display this message to get additional information about the occurred error.
   */
  message: string;
}

export enum MessageType {
  success = 'success',
  info = 'info',
  warning = 'warning',
  error = 'error',
}

export interface Message {
  type: MessageType;
  title?: string;
  text: string;
}

export enum LogEntryType {
  debug = 'debug',
  info = 'info',
  warning = 'warning',
  error = 'error',
}

export interface LogEntry {
  type: LogEntryType;
  message: string;
  details: Array<unknown>;
}

export interface LiveSuggestion {
  preferredPhrase: string;
  description: string;
}

export interface LiveSearchResult {
  requestId: string;
  results: LiveSuggestion[];
}

/**
 * The sidebar will provide this interface in window.acrolinxSidebar.
 */
export interface AcrolinxSidebar {
  /**
   * Initializes the sidebar with the specified initParameters.
   * After calling this method, the sidebar will become ready for checking and call onInitFinished.
   *
   * ```
   *  acrolinxSidebar.init({
   *    clientSignature: 'sdfasdfiIOJEIEJIOR',
   *    clientComponents: [{
   *      id: 'com.acrolinx.myEditor'
   *      name:'Acrolinx for myEditor',
   *      version:'1.0.0.42'
   *    }]
   *  });
   * ```
   */
  init(initParameters: InitParameters): void;

  /**
   * Configures the sidebar with the specified parameters.
   * This method can be called repeatedly after init was called.
   *
   * ```
   *  acrolinxSidebar.configure({
   *    readOnlySuggestions: true
   *  });
   * ```
   */
  configure(configuration: SidebarConfiguration): void;

  /**
   *  Perform a check of the whole document. Once the check is done, {@link AcrolinxPlugin.onCheckResult} will be
   * notified.
   *
   * ```
   * acrolinxSidebar.checkGlobal('<sample>my text</sample>', {
   *    inputFormat: 'XML',
   *    requestDescription: {
   *      documentReference: 'myfile.xml'
   *    }
   * });
   * ```
   *
   * @param documentContent The document you want to check.
   * @return Object containing the ID of the check.
   *
   */
  checkGlobal(documentContent: string, options: CheckOptions): Check;

  /**
   * Perform a batch check of the document components.
   * @param documentIdentifiers List of document identifiers on which to perfrom a batch check.
   */
  initBatchCheck?(documentIdentifiers: BatchCheckRequestOptions[]): void;

  /**
   * Initiates a check for the document with the given document identifier.
   *
   * @param documentIdentifier Identifier for the document to be checked.
   * @param documentContent The document to be checked.
   * @param options Check options.
   */
  checkDocumentInBatch?(documentIdentifier: string, documentContent: string, options: CheckOptions): void;

  onGlobalCheckRejected(): void;

  /**
   * This function can be used to invalidate check result cards that link to invalid parts of the document.
   * That can happen due to changes or deletions in the document.
   *
   * @param invalidCheckedDocumentRanges  checkIds and offsets belonging to a previous performed check.
   */
  invalidateRanges(invalidCheckedDocumentRanges: InvalidDocumentPart[]): void;

  /**
   * Notify the sidebar of the currently displayed part of the document.
   *
   * @param checkedDocumentRanges The ranges of previous performed checks.
   */
  onVisibleRangesChanged(checkedDocumentRanges: CheckedDocumentRange[]): void;

  /**
   * Show a message in the Sidebar.
   * Supported since Acrolinx Platform 2021.2 (Sidebar version 14.28).
   * @param message The message to show.
   */
  showMessage(message: Message): void;

  /**
   * Perform a search for suggestions with the given query .
   * @param query The query on which to perform a search for suggestions.
   */
  liveSearch?(query: string): void;
}

/**
 * The plug-in should provide this interface in window.acrolinxPlugin.
 * These functions are called by the AcrolinxSidebar.
 */
export interface AcrolinxPlugin {
  /**
   *  The sidebar has loaded and requests the AcrolinxPlugin to call acrolinxSidebar.init().
   */
  requestInit(): void;

  /**
   * The sidebar has finished initialization. Now the sidebar is ready for checking.
   *
   *  @param finishResult Can contain an error if the initialization failed.
   */
  onInitFinished(finishResult: InitResult): void;

  /**
   * The check button has been pushed and the AcrolinxPlugin is requested to call AcrolinxSidebar.checkGlobal().
   * If the plugin supports checkSelection (InitParameters.supported.checkSelection), option "selection" will be set
   * and contains a hint if the plugin should send the current selection when calling AcrolinxSidebar.checkGlobal().
   * Similarly if the plugin supports batchCheck (InitParameters.supported.supportsBatchChecks), option "batchCheck"
   * will be set and the plugin should call AcrolinxSidebar.initBatchCheck().
   */
  requestGlobalCheck(options?: RequestGlobalCheckOptions): void;

  /**
   * A batch check has started and the AcrolinxPlugin is requested to call AcrolinxSidebar.checkDocumentInBatch()
   * for the document under check.
   *
   * @param documentIdentifier Identifier of the document to be checked.
   */
  requestCheckForDocumentInBatch?(documentIdentifier: string): void;

  /**
   * A batch check has started and the user has clicked on a card. The AcrolinxPlugin is requested to open the corresponding document.
   *
   * @param documentIdentifier Identifier of the document to open.
   */
  openDocumentInEditor?(documentIdentifier: string): void | Promise<void>;

  /**
   * Notifies the AcrolinxPlugin that a check has finished. If a global check has been performed, that's a good time
   * to clean up states belonging to previous checks.
   */
  onCheckResult(checkResult: CheckResult): void;

  /**
   * The integration should highlight and focus the matches belonging to the check of the checkId.
   * For selecting ranges, different strategies can be applied. A short overview:
   *
   * 1) Search: You just search for the content-attributes of the matches. The search can be improved by some fuzzy
   * matching and adding some characters from before and after the match to the search string. pro: easy in a simple
   * version, more or less stateless - con: fuzzy
   *
   * 2) Mapping: At the time you call check, you keep the document content and create a one to one mapping between
   * the document you checked and the document in your editor. This mapping needs to be kept up to date. Some editors
   * provide interfaces to easily implement that. pro: up to 100% exact - con: can be difficult or impossible to
   * implement, can be slow, requires a lot of memory
   *
   * 3) Indexing: Before calling check, you scatter indices in the document, which can be kept in source as well as
   * in the requested document. These indices reduce the search space later on, so that your search will be faster
   * and more precise. pro: fast, up to 100% precise - con: invasive, changes the source document
   *
   * 4) Combinations: You can combine all these methods to improve the positive aspects and reduce the negative
   * aspects of each strategy.
   *
   * Note: Implementing this function will be one of your core tasks while developing an Acrolinx integration.
   *
   * @param checkId The id of the check. You get the id as result of checkGlobal.
   * @param matches The parts of the document which should be highlighted.
   */
  selectRanges(checkId: string, matches: Match[]): void;

  /**
   * The integration should replace the matches belonging to the check of the checkId by its replacements.
   *
   * Note that in most cases you are able to reuse much of the implementation for {@link selectRanges}.
   *
   * @param checkId  The id of the check. You get the id as result of checkGlobal.
   * @param matchesWithReplacements The parts of the document, which should be replaced and its replacements.
   */
  replaceRanges(checkId: string, matchesWithReplacements: MatchWithReplacement[]): void;

  /**
   * @param openWindowParameters
   */
  openWindow(openWindowParameters: OpenWindowParameters): void;

  /**
   * This method should open the log file.
   */
  openLogFile?(): void;

  showServerSelector?(): void;

  log?(logEntry: LogEntry): void;

  /**
   * Notifies the AcrolinxPlugin that a live search has finished.
   * @param liveSearchResult  The live search result.
   */
  onLiveSearchResults?(liveSearchResult: LiveSearchResult): void;

  /**
   * Notifies the AcrolinxPlugin that live search for an input query has failed.
   * @param query  The query on which the search has failed.
   */
  onLiveSearchFailed?(query: string): void;

  /**
   * the user has clicked on the button to open live panel. The AcrolinxPlugin is requested to open the live panel.
   */
  openLivePanel?(): void;

  /**
   * Notifies the AcrolinxPlugin that the user has changed the UI langauge in the sidebar.
   * @param UILanguage   The selected UI language
   */
  onUILanguageChanged?(UILanguage: string): void;

  /**
   * Notifies the AcrolinxPlugin that the user has selected a target that supports live.
   * @param supportsLive   True if the selected target supports live, false otherwise.
   */
  onTargetChanged?(supportsLive: boolean): void;
}

/**
 * By default the Sidebar will use window.localStorage to store data.
 * The integration can provide this interface in window.acrolinxStorage as replacement for window.localStorage.
 */
export interface AcrolinxStorage {
  getItem(key: string): string | null;

  removeItem(key: string): void;

  setItem(key: string, data: string): void;
}

import * as vscode from "vscode";
import { KMBasicCompletionProvider } from "./completionProvider";
import { KMBasicHoverProvider } from "./hoverProvider";
import { KMBasicSymbolProvider } from "./symbolProvider";
import { ALL_KEYWORDS } from "./kmbasic/keywords";

const LANGUAGE = "kmbasic";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      LANGUAGE,
      new KMBasicCompletionProvider(),
      // KM-BASIC uses "." for object fields and ":" twice for static access,
      // so both are worth retriggering on.
      ".",
      ":",
    ),
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(LANGUAGE, new KMBasicHoverProvider()),
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      LANGUAGE,
      new KMBasicSymbolProvider(),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("kmbasic.showKeywordCount", () => {
      vscode.window.showInformationMessage(
        `KM-BASIC: ${ALL_KEYWORDS.length} keywords loaded.`,
      );
    }),
  );
}

export function deactivate(): void {
  // Nothing to clean up. Everything is registered through subscriptions.
}

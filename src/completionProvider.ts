import * as vscode from "vscode";
import {
  ALL_KEYWORDS,
  KMBasicKeyword,
  KMBasicKind,
  insertTextFor,
  labelFor,
  renderKeywordMarkdown,
} from "./kmbasic/keywords";

/**
 * Items are built once at construction. None of them depend on context, and
 * rebuilding a few hundred CompletionItems on every keystroke is wasteful.
 */
export class KMBasicCompletionProvider
  implements vscode.CompletionItemProvider
{
  private readonly allItems: vscode.CompletionItem[];
  private readonly classItems: vscode.CompletionItem[];

  constructor() {
    this.allItems = ALL_KEYWORDS.map((kw) => this.buildItem(kw));

    // After USECLASS only a class name makes sense.
    this.classItems = ALL_KEYWORDS.filter((kw) => kw.kind === "class").map(
      (kw) => this.buildItem(kw),
    );
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext,
  ): vscode.CompletionItem[] {
    const linePrefix = document
      .lineAt(position.line)
      .text.substring(0, position.character);

    if (this.inCommentOrString(linePrefix)) {
      return [];
    }

    if (/\bUSECLASS\s+[A-Za-z0-9_,]*$/i.test(linePrefix)) {
      return this.classItems;
    }

    return this.allItems;
  }

  private buildItem(kw: KMBasicKeyword): vscode.CompletionItem {
    const item = new vscode.CompletionItem(labelFor(kw), this.kindOf(kw.kind));

    item.insertText = new vscode.SnippetString(insertTextFor(kw));
    item.documentation = new vscode.MarkdownString(renderKeywordMarkdown(kw));

    // The type suffix is the most useful thing to show at a glance, because
    // SQRT#, VAL# and VAL are otherwise easy to mix up.
    item.detail =
      kw.valueType === "none"
        ? kw.category
        : `${kw.category} (${kw.valueType})`;

    item.filterText = labelFor(kw);
    item.sortText = this.sortKeyOf(kw);

    return item;
  }

  /**
   * Language keywords sort ahead of library class names, which are only
   * relevant when the user has actually installed the LIB directory.
   */
  private sortKeyOf(kw: KMBasicKeyword): string {
    return (kw.kind === "class" ? "5" : "1") + labelFor(kw);
  }

  private kindOf(kind: KMBasicKind): vscode.CompletionItemKind {
    switch (kind) {
      case "function":
        return vscode.CompletionItemKind.Function;
      case "statement":
        return vscode.CompletionItemKind.Method;
      case "system":
        return vscode.CompletionItemKind.Property;
      case "constant":
        return vscode.CompletionItemKind.Constant;
      case "operator":
        return vscode.CompletionItemKind.Operator;
      case "class":
        return vscode.CompletionItemKind.Class;
      case "keyword":
      default:
        return vscode.CompletionItemKind.Keyword;
    }
  }

  /**
   * Cheap check for a cursor inside a comment or an unterminated string.
   * KM-BASIC has no apostrophe comment, only REM, so this is simpler than
   * the equivalent for most BASIC dialects.
   */
  private inCommentOrString(linePrefix: string): boolean {
    let inString = false;

    for (let i = 0; i < linePrefix.length; i++) {
      if (linePrefix[i] === '"') {
        inString = !inString;
      }
    }

    if (inString) {
      return true;
    }

    return /(^|:)\s*REM\b/i.test(linePrefix);
  }
}

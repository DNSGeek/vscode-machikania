import * as vscode from "vscode";

/**
 * KM-BASIC has no SUB blocks, so the outline is built from LABEL and METHOD
 * declarations plus line numbers used as jump targets. Without this, the
 * outline and Go to Symbol are empty for every file.
 */
export class KMBasicSymbolProvider implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken,
  ): vscode.SymbolInformation[] {
    const symbols: vscode.SymbolInformation[] = [];

    for (let i = 0; i < document.lineCount; i++) {
      if (token.isCancellationRequested) {
        break;
      }

      const line = document.lineAt(i);
      const text = line.text;

      const label = /^\s*LABEL\s+([A-Za-z_][A-Za-z0-9_]*)/i.exec(text);
      if (label) {
        symbols.push(
          this.make(label[1], vscode.SymbolKind.Function, document, line),
        );
        continue;
      }

      const method = /^\s*METHOD\s+([A-Za-z_][A-Za-z0-9_]*)/i.exec(text);
      if (method) {
        symbols.push(
          this.make(method[1], vscode.SymbolKind.Method, document, line),
        );
        continue;
      }

      const field = /^\s*(FIELD|STATIC)\s+(?:PUBLIC\s+|PRIVATE\s+)?(.+)$/i.exec(
        text,
      );
      if (field) {
        for (const name of field[2].split(",")) {
          const trimmed = name.trim();
          if (trimmed) {
            symbols.push(
              this.make(trimmed, vscode.SymbolKind.Field, document, line),
            );
          }
        }
      }
    }

    return symbols;
  }

  private make(
    name: string,
    kind: vscode.SymbolKind,
    document: vscode.TextDocument,
    line: vscode.TextLine,
  ): vscode.SymbolInformation {
    return new vscode.SymbolInformation(
      name,
      kind,
      "",
      new vscode.Location(document.uri, line.range),
    );
  }
}

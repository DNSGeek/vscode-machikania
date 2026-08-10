import * as vscode from "vscode";
import {
  KMBASIC_WORD_PATTERN,
  MAX_KEYWORD_WORDS,
  KMBasicKeyword,
  findKeyword,
  findLongestKeyword,
  renderKeywordMarkdown,
} from "./kmbasic/keywords";

export class KMBasicHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    // The default word pattern breaks on # and $, which would reduce SQRT#
    // to SQRT and HEX$ to HEX. Neither exists on its own, so hover would
    // silently do nothing for every float and string function.
    const range = document.getWordRangeAtPosition(
      position,
      KMBASIC_WORD_PATTERN,
    );

    if (!range) {
      return null;
    }

    const line = document.lineAt(position.line).text;
    const match = this.matchAt(line, range);

    if (!match) {
      return null;
    }

    const markdown = new vscode.MarkdownString(
      renderKeywordMarkdown(match.keyword),
    );
    markdown.isTrusted = false;

    return new vscode.Hover(markdown, match.range);
  }

  /**
   * Resolves the hovered word, preferring the longest multi word keyword it
   * belongs to, so hovering either word of INTERRUPT STOP describes
   * INTERRUPT STOP rather than INTERRUPT.
   */
  private matchAt(
    line: string,
    range: vscode.Range,
  ): { keyword: KMBasicKeyword; range: vscode.Range } | undefined {
    const words = this.wordsWithPositions(line);
    const cursorIndex = words.findIndex(
      (w) => w.start <= range.start.character && w.end >= range.end.character,
    );

    if (cursorIndex < 0) {
      return undefined;
    }

    const firstStart = Math.max(0, cursorIndex - (MAX_KEYWORD_WORDS - 1));

    for (let start = firstStart; start <= cursorIndex; start++) {
      const slice = words.slice(start, start + MAX_KEYWORD_WORDS);
      const keyword = findLongestKeyword(slice.map((w) => w.text));

      if (!keyword) {
        continue;
      }

      const wordCount = keyword.name
        .replace(/\s*\(interrupt\)$/, "")
        .replace(/\($/, "")
        .split(" ").length;
      const last = start + wordCount - 1;

      // The match must actually cover the word under the cursor.
      if (last < cursorIndex || last >= words.length) {
        continue;
      }

      return {
        keyword,
        range: new vscode.Range(
          range.start.line,
          words[start].start,
          range.start.line,
          words[last].end,
        ),
      };
    }

    const keyword = findKeyword(words[cursorIndex].text);
    return keyword ? { keyword, range } : undefined;
  }

  private wordsWithPositions(
    line: string,
  ): { text: string; start: number; end: number }[] {
    const pattern = new RegExp(KMBASIC_WORD_PATTERN.source, "g");
    const out: { text: string; start: number; end: number }[] = [];

    let m: RegExpExecArray | null;
    while ((m = pattern.exec(line)) !== null) {
      out.push({ text: m[0], start: m.index, end: m.index + m[0].length });

      if (m.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }

    return out;
  }
}

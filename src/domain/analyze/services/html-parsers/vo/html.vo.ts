import { parse } from 'node-html-parser';
import { SelectorInterface } from '../dto/selector.interface';
import { SelectorTypeEnum } from '../enums/selector-type.enum';
import { XpathSelectorDto } from '../dto/xpath-selector.dto';
import { CssSelectorDto } from '../dto/css-selector.dto';
import * as xPathToCss from 'xpath-to-css';
import HTMLElement from 'node-html-parser/dist/nodes/html';
import striptags from 'striptags';
import { Logger } from '@nestjs/common';

export class HtmlVo {
  private readonly logger = new Logger(HtmlVo.name);

  private readonly html: HTMLElement;

  private filterInnerHtml(resultString: string): string {
    return striptags(resultString)
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  public extractAllBySelector(selector: SelectorInterface): string[] {
    if (selector.type === SelectorTypeEnum.XPATH) {
      return this.extractAllDataByXpath(selector);
    }

    if (selector.type === SelectorTypeEnum.CSS) {
      return this.extractAllDataByCss(selector);
    }

    return null;
  }

  public extractBySelectors(selectors: SelectorInterface[]): string {
    let result = null;

    selectors.forEach((value) => {
      if (value.type === SelectorTypeEnum.XPATH) {
        const subResult = this.extractDataByXpath(value);
        if (subResult) {
          result = subResult;
        }
      }

      if (value.type === SelectorTypeEnum.CSS) {
        const subResult = this.extractDataByCss(value);
        if (subResult) {
          result = subResult;
        }
      }
    });

    return result;
  }

  private extractDataByXpath(xPathSelectorDto: XpathSelectorDto): string {
    const filteredXpath = xPathSelectorDto.selector.replace(/( and contains\(.*\))/gim, '');
    const cssSelector = new CssSelectorDto(null, xPathSelectorDto.attribute);

    try {
      cssSelector.selector = xPathToCss(filteredXpath);
    } catch (e) {
      this.logger.error(
        `Unable to convert Xpath selector to the css. ${xPathSelectorDto.selector} seems to be wrong`,
        e.stack,
      );

      return null;
    }

    return this.extractDataByCss(cssSelector);
  }

  private extractDataByCss(cssSelectorDto: CssSelectorDto): string {
    const element = this.html.querySelector(cssSelectorDto.selector);
    if (!element) {
      return null;
    }

    if (!cssSelectorDto.attribute) {
      return this.filterInnerHtml(element.innerHTML);
    }

    return String(element.getAttribute(cssSelectorDto.attribute)).trim();
  }

  private extractAllDataByXpath(xPathSelectorDto: XpathSelectorDto): string[] {
    const cssSelector = new CssSelectorDto(null, xPathSelectorDto.attribute);

    try {
      cssSelector.selector = xPathToCss(xPathSelectorDto.selector);
    } catch (e) {
      this.logger.error(
        `Unable to convert Xpath selector to the css. ${xPathSelectorDto.selector} seems to be wrong`,
        e.stack,
      );

      return null;
    }

    return this.extractAllDataByCss(cssSelector);
  }

  private extractAllDataByCss(cssSelectorDto: CssSelectorDto): string[] {
    const elements = this.html.querySelectorAll(cssSelectorDto.selector);
    if (!elements) {
      return null;
    }

    return elements.map((element) => {
      if (!cssSelectorDto.attribute) {
        return this.filterInnerHtml(element.innerHTML);
      }

      return String(element.getAttribute(cssSelectorDto.attribute)).trim();
    });
  }

  private filterSvg(): void {
    const svgElements = this.html.querySelectorAll('svg');
    svgElements.forEach((element) => element.remove());
  }

  constructor(html: string) {
    this.html = parse(html);
    this.filterSvg();
  }
}

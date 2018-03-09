# Pageable Library

[![travis build](https://travis-ci.org/hallysonh/pageable.svg?branch=master)](https://travis-ci.org/hallysonh/pageable)
[![Greenkeeper badge](https://badges.greenkeeper.io/hallysonh/pageable.svg)](https://greenkeeper.io/)
[![version](https://img.shields.io/npm/v/@hallysonh/pageable.svg)](http://npm.im/@hallysonh/pageable)
[![MIT License](https://img.shields.io/github/license/hallysonh/pageable.svg)](https://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

* [About](#about)
* [Overview](#overview)
  * [Request](#request)
    * [Pageable](#pageable)
    * [Sort](#sort)
    * [Errors](#errors)
  * [Response](#response)
    * [All Page types](#all-page-types)
      * [Map Method](#map-method)
    * [ArrayPage](#arraypage)
    * [IndexedPage](#indexedpage)
    * [IndexablePage](#indexablepage)
    * [Output Format](#output-format)
      * [Non\-Indexed](#non-indexed)
      * [Indexed](#indexed)
* [Getting Started](#getting-started)
  * [Installation](#installation)
    * [npm](#npm)
    * [yarn](#yarn)
  * [Requirements](#requirements)
  * [Examples](#examples)
* [API Documentation](#api-documentation)

## About

`pageable` is a bundle of utility classes used to deal with pagination inspired by  [Spring Data](http://docs.spring.io/spring-data/commons/docs/current/reference/html/)'s Pagination support.

## Overview

### Request

#### Pageable

The `Pageable` object created from the query parameters contains two integers, `page` & `size`, an optional `Sort` instance, and an `indexed` boolean.
This `pageable` instance should  be passed to your data access layer, and its content should be used to restrict the returned data to the data specified by the `pageable`.

#### Sort

`Sort` is a collection of `property` and `direction`( `asc` or `desc`) pairs.
Each `sort` instance has a `forEach(callback(property,direction))` method that invokes `callback` for each `property`/`direction` pair in the `sort`

#### Errors

If the `page` or `size` query parameter are not specified as valid numbers, a `NumberFormatError` will be thrown. If the sort direction is specified as anything other than `asc` or `desc` (e.g. `sort=lastName:foo`) then an `InvalidSortError` will be thrown.

### Response

The data returned from a using this middleware should be an instance of a subclass of `Page`.

#### All Page types

All `Page` types contain the following properties:

Property           | Description
-------------------|------------
`number`           | The number of the current page (should match `pageable.page`)
`size`             | The number of elements requested to be included in the current page (should match `pageable.size`)
`numberOfElements` | The number of elements actually returned in this page. If < size, indicates that this is the last page
`totalElements`    | Total number of elements available
`totalPages`       | Total number of pages available
`sort`             | The sort criteria (should match `pageable.sort`)
`first`            | True if this is the first page
`last`             | True if this is the final page

You may have noticed that the above list does not define a property containing the actual content to be returned.
This is because there are multiple `Page` implementations which represent the actual content items in different formats.

##### Map Method

All Page types also provide a `map(iteratee)` method. This method iterates over each content item in the page and invokes iteratee with the content item as the argument,
allowing easy transformation from a `Page<X>` to a `Page<Y>`. This is useful, for instance, if you wish to return a different object
from your `router` than the type returned from your data layer.

#### ArrayPage

A `Page` of content items represented as an array. An `ArrayPage` contains all of the properties above plus:

Property  | Description
----------|------------
`content` | Array of content ordered as per `pageable.sort`

#### IndexedPage

An `IndexedPage` represents the returned content as an array of `ids` and a corresponding `index`, which is a map of `{id: content item}`.
An `IndexedPage` contains all of the standard page properties plus:

Property | Description
---------|------------
`ids`    | Array of ids ordered as per `pageable.sort`
`index`  | Map of id to content item

#### IndexablePage

An `IndexablePage` is a special case of `Page`, it internally stores its data in the same format as a `ArrayPage` but allows the client some level of control over the response structure.
Upon serialization (i.e. invoking `toJSON()`) if the `pageable.indexed` value is set to `true`, the result will be serialized as an `IndexedPage` (else as an `ArrayPage`).
In order to support this automatic conversion, the underlying content items _must_ each contain an `id` property.

## Getting Started

### Installation

#### npm

```bash
npm install @hallysonh/pageable
```

#### yarn

```bash
yarn add @hallysonh/pageable
```

### Requirements

Requires `node` >= `8.2`, as `pageable` makes use of async/await. [Flow](http://flowtype.org) bindings are also provided.
Note: The following examples includes optional flow type annotations for clarity.

`pageable` is a convenient library for managing conversion of user intent (via request parameters) into a `Pageable` object, but it is still your responsibility to implement that intention when accessing data. You are responsible for ensuring that your data access tier properly implements the pagination and/or sorting, and for creating the `Page` instances to be returned. The exact approach for doing so will differ based on your chose Data Access framework.

### Examples

```typescript
import { Pageable, IndexedPage } from '@hallysonh/pageable';

...
```

## API Documentation

Access the documentation [here](https://hallysonh.github.io/pageable/)

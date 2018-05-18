import {
  Direction,
  ArrayPage,
  IndexablePage,
  IndexedPage,
  Order,
  Pageable,
  Sort,
  NumberFormatError,
  InvalidSortError
} from '../src/pageable';

describe('Tests', () => {
  const orders = [
    new Order('propertyA', Direction.asc),
    new Order('propertyB', Direction.desc),
    new Order('propertyC', Direction.asc),
    new Order('propertyD', Direction.desc),
    new Order('propertyE', Direction.desc),
  ];

  const pageOrders = [
    new Order('firstName', Direction.asc),
    new Order('lastName', Direction.asc),
  ];

  const content = [
    { id: 1, firstName: 'Bob', lastName: 'Stevens' },
    { id: 2, firstName: 'Steve', lastName: 'Bobbins' },
    { id: 3, firstName: 'Robert', lastName: 'Stevenson' },
    { id: 4, firstName: 'Stevarino', lastName: 'Robertson' },
  ];

  describe('Order class', () => {
    it('returns "asc" for the static _DEFAULT_DIRECTION class property', () => {
      expect(Order._DEFAULT_DIRECTION).toEqual('asc');
    });

    it('instance.direction returns "asc" if no direction is specified in constructor', () => {
      const order = new Order('testProp');
      expect(order.direction).toEqual('asc');
    });

    it('instance.direction returns "desc" if direction parameter exactly matches "desc" in constructor', () => {
      const order = new Order('testProp', Direction.desc);
      expect(order.direction).toEqual('desc');
    });
  });

  describe('Sort class', () => {
    it('instance.toJSON() method result matches snapshot', () => {
      const sort = new Sort(orders);
      expect(sort.toJSON()).toMatchSnapshot();
    });

    it('iterates over orders using for...of loop', () => {
      const sort = new Sort(orders);
      const result = [];
      for (const order of sort.orders) {
        result.push(order);
      }
      expect(result).toMatchSnapshot();
    });

    it('iterates.iterator() works', () => {
      const sort = new Sort(orders);
      const it = sort.iterator();
      expect(it.next().value).toBe(orders[0]);

      let last = null;
      let item = null;
      while(!(item = it.next()).done) {
        last = item.value;
      }
      expect(last).toBe(orders[orders.length - 1]);
    });

    it('instance.forEach() method result matches snapshot', () => {
      const sort = new Sort(orders);
      const valueGroups = {
        properties: [],
        directions: [],
      };
      const iteratee = (property, direction) => {
        valueGroups.properties.push(property);
        valueGroups.directions.push(direction);
      };
      sort.forEach(iteratee);
      expect(valueGroups).toMatchSnapshot();
    });
  });

  describe('Pageable class', () => {
    it('default values match snapshot when constructor parameters are undefined', () => {
      const pageable = new Pageable();
      expect(pageable).toMatchSnapshot();
    });

    [
      { value: 'singleValue', type: 'string' },
      { value: ['valueA', 'valueB:desc', 'valueC:asc'], type: 'array of strings' },
      { value: 'valueA;valueB:desc;valueC:asc', type: 'string with many order items' },
      { value: new Sort(orders.slice(1, 3)), type: 'sort' },
    ].forEach(({ value, type }) => {
      it(`returns a valid Sort instance when a value of type ${type} is passed to the constructor`, () => {
        const pageable = new Pageable(1, 10, true, value);
        expect(pageable.sort).toMatchSnapshot();
      });
    });

    it('disregards extra commas in the sort array passed in as a parameter', () => {
      const invalidSort = ['valueA,', 'valueB,,', 'valueC,,,'];
      const result = new Pageable(0, 20, false, invalidSort);
      const invalidValues = result.sort.orders.filter(order => (order.property.length === 0));
      expect(invalidValues).toHaveLength(0);
    });

    it('disregards extra colons in the sort array passed in as a parameter', () => {
      const invalidSort = ['valueA:desc', 'valueB::desc', 'valueC::::desc'];
      const pageable = new Pageable(0, 20, false, invalidSort);
      const invalidValues = pageable.sort.orders.filter(order => (order.property.length === 0));
      expect(invalidValues).toHaveLength(0);
    });

    it('throws error when invalid sort direction is provided', async () => {
      try {
        // tslint:disable-next-line:no-unused-expression
        new Pageable(0, 10, false, 'firstName:foo');
      } catch (e) {
        expect(e.message).toBe('Invalid Sort Direction, must be one of "asc" or "desc"');
      }
    });
  });

  describe('ArrayPage class', () => {
    const getValidPage = () => {
      const sort = new Sort(pageOrders);
      const pageable = new Pageable(0, 20, false, sort);
      return new ArrayPage(content, 2, pageable);
    };

    it('matches snapshot when valid parameters are passed to the constructor', () => {
      const result = getValidPage();
      expect(result).toMatchSnapshot();
    });

    it('results of instance.map() method result matches snapshot', () => {
      const page = getValidPage();
      const result = page.map((pageContent, idx) => ({ ...pageContent, age: (idx * 5) }));
      expect(result).toMatchSnapshot();
    });

  });

  describe('IndexedPage class', () => {
    const getValidIndexedPage = () => {
      const sort = new Sort(pageOrders);
      const pageable = new Pageable(0, 20, false, sort);
      const ids = [1, 2];
      const index = new Map<number, any>();
      content.forEach(x => index.set(x.id, x));
      return new IndexedPage(ids, index, 2, pageable);
    };

    it('matches snapshot when valid parameters are passed to the constructor', () => {
      const result = getValidIndexedPage();
      expect(result).toMatchSnapshot();
    });

    it('results of instance.map() method result matches snapshot', () => {
      const page = getValidIndexedPage();
      const result = page.map((pageContent, idx) => ({ ...pageContent, age: (idx * 5) }));
      expect(result).toMatchSnapshot();
    });
  });

  describe('IndexablePage class', () => {
    const getValidIndexablePage = (isIndexed = false) => {
      const sort = new Sort(pageOrders);
      const pageable = new Pageable(0, 20, isIndexed, sort);
      return new IndexablePage(content, 2, pageable);
    };

    it('matches snapshot when valid parameters are passed to the constructor', () => {
      const result = getValidIndexablePage();
      expect(result).toMatchSnapshot();
    });

    it('results of instance.map() method result matches snapshot', () => {
      const page = getValidIndexablePage();
      const result = page.map((pageContent, idx) => ({ ...pageContent, age: (idx * 5) }));
      expect(result).toMatchSnapshot();
    });

    it('instance.toJSON() method result matches snapshot', () => {
      const page = getValidIndexablePage(true);
      const result = page.toJSON();
      expect(result).toMatchSnapshot();
    });
  });
});

## Entity State adapter for managing record collections

Entity provides an API to manipulate and query entity collections:

-   Provides performant CRUD operations for managing entity collections;
-   Extensible type-safe adapters for selecting entity information;
-   Entity promotes the use of plain JavaScript objects when managing collections. ES6 class instances will be;
    transformed into plain JavaScript objects when entities are managed in a collection.

#### What is an Entity?

In NGXS, we store different types of state in the store, and this typically includes:

-   business data, such as for example Courses or Lessons, in the case of an online course platform;
-   some UI state, such as for example UI user preferences.

An Entity represents some sort of business data, so Course and Lesson are examples of entity types.

In our code, an entity is defined as a Typescript type definition. For example, in an online course system, the most
important entities would be Course and Lesson, defined with these two custom object types:

```ts
export interface Course {
    id: number;
    description: string;
    iconUrl?: string;
    courseListIcon?: string;
    longDescription?: string;
    category: string;
    seqNo: number;
    lessonsCount?: number;
    promo?: boolean;
}

export interface Lesson {
    id: number;
    description: string;
    duration: string;
    seqNo: number;
    courseId?: number;
    videoId?: string;
}
```

#### The Entity unique identifier

As we can see, both entities have a unique identifier field called id, which can be either a string or a number. This is
a technical identifier that is unique to a given instance of the entity: for example, no two courses have the same id.

Most of the data that we store in the store are entities!

#### How to store collections of entities in a NGXS Store?

Let's say that for example, we would like to store a collection of courses in the in-memory store: how would we do that?
One way would be to store the courses in an array, under a courses' property.

The complete store state would then look something like this:

```json5
{
    courses: [
        {
            id: 0,
            description: 'Angular NGXS Course',
            category: 'BEGINNER',
            seqNo: 1
        },
        {
            id: 1,
            description: 'Angular for Beginners',
            category: 'BEGINNER',
            seqNo: 2
        },
        {
            id: 2,
            description: 'Angular Security Course - Web Security Fundamentals',
            category: 'ADVANCED',
            seqNo: 3
        }
    ],
    lessons: [
        {
            id: 1,
            description: 'Angular Tutorial For Beginners - Build Your First App - Hello World Step By Step',
            duration: '4:17',
            seqNo: 1,
            courseId: 1
        },
        {
            id: 2,
            description: 'Building Your First  Component - Component Composition',
            duration: '2:07',
            seqNo: 2,
            courseId: 1
        }
    ]
}
```

#### Why not store related entities in an Array?

Storing entities in the store in the form of an array is the first thing that comes to mind, but that approach can cause
several potential problems:

-   if we want to look up a course based on it's known id, we would have to loop through the whole collection, which
    could be inefficient for very large collections (500-1000K+);

-   more than that, by using an array we could accidentally store different versions of the same course (with the same
    id) in the array;

-   For example, take the simple case of adding a new entity to the collection. We would be reimplementing several times
    the exact same logic for adding a new entity to the collection and reordering the array in order to obtain a certain
    custom sort order.

As we can see, the format under which we store our entities in the store has a big impact on our applications. Let's
then try to find out what would be the ideal format for storing entities in the store.

#### Designing the entity store state: Arrays or Maps (HashMap, PlainObject, etc)?

One of the roles of the store is to act as an in-memory client-side database that contains a slice of the whole
database, from which we derive our view models on the client side via selectors.

This works as opposed to the more traditional design that consists in bringing the view model from the server via API
calls. Because the store is an in-memory database, it would make sense to store the business entities in their own
in-memory database "table", and give them a unique identifier similar to a primary key.

The data can then be flattened out, and linked together using the entity unique identifiers, just like in a database.

A good way of modeling that is to store the entity collection under the form of a Javascript object, which works just
like a Map. In this setup, the key of the entity would be the unique id, and the value would be the whole object.

In that new format, this is what the whole store state would look like:

```json5
{
    courses: {
        0: {
              id: 0,
              description: "Angular NGXS Course",
              category: 'BEGINNER',
              seqNo: 1
           },
        },
        1: {
              id: 1,
              description: "Angular for Beginners",
              category: 'BEGINNER',
              seqNo: 2
        },
        2: {
              id: 2,
              description: "Angular Security Course - Web Security Fundamentals",
              category: 'BEGINNER',
              seqNo: 3
        }
    },
    lessons: {
        1: {
            id: 1,
            "description": "Angular Tutorial For Beginners - Build Your First App - Hello World Step By Step",
            "duration": "4:17",
            "seqNo": 1,
            courseId: 1
        },
        2: {
            id: 2,
            "description": "Building Your First  Component - Component Composition",
            "duration": "2:07",
            "seqNo": 2,
            courseId: 1
        },
        ....
        35: {
            id: 35,
            "description": "Unidirectional Data Flow And The Angular Development Mode",
            "duration": "7:07",
            "seqNo": 6,
            courseId: 0
        }
    }
}
```

#### Designing the state for id lookups

As we can see, this format makes it really simple to lookup entities by id, which is a very common operation. For
example, in order to lookup the course with an id of 1, we would simply have to write:

`state.courses[1]`

It also flattens out the state, making it simpler to combine the multiple entities and 'join' them via a selector query.
But there is only one problem: we have lost the information about the order of the collection!

This is because the properties of a Javascript object have no order associated to them, unlike arrays. Is there are any
to still store our data by id in a map, and still preserve the information about the order?

#### Designing the state for preserving entity order

Yes there is, we just have to use both a Map and an Array! We store the objects in a map (called entities), and we store
the order information in an array (called ids):

```json5
{
    courses: {
        ids: [0, 1, 2],
        entities: {
            0: {
                  id: 0,
                  description: "Angular NGXS Course",
                  category: 'BEGINNER',
                  seqNo: 1
               },
            },
            1: {
                  id: 1,
                  description: "Angular for Beginners",
                  category: 'BEGINNER',
                  seqNo: 2
            },
            2: {
                  id: 2,
                  description: "Angular Security Course - Web Security Fundamentals",
                  category: 'BEGINNER',
                  seqNo: 3
            }
        }
    },
    lessons: {
        ids: [1, 2, ... 35],
        entities: {
            1: {
                id: 1,
                "description": "Angular Tutorial For Beginners - Build Your First App - Hello World Step By Step",
                "duration": "4:17",
                "seqNo": 1,
                courseId: 1
            },
            2: {
                id: 2,
                "description": "Building Your First  Component - Component Composition",
                "duration": "2:07",
                "seqNo": 2,
                courseId: 1
            },
            ....
            35: {
                id: 35,
                "description": "Unidirectional Data Flow And The Angular Development Mode",
                "duration": "7:07",
                "seqNo": 6,
                courseId: 0
            }
        }
    }
}
```

#### The Entity State format

This state format, which combines a map of entities with an array of ids is known as the Entity State format.

This is the ideal format for storing business entities in a centralized store, but maintaining this state would
represent an extra burden while writing our reducers and selectors, if we would have to write them manually from
scratch.

For example, if we would have to write some type definitions to represent the complete store state, they would look
something like this:

```ts
export interface CoursesEntityCollections {
    ids: number[];
    entities: { [key: number]: Course };
}

export interface LessonsEntityCollections {
    ids: number[];
    entities: { [key: number]: Lesson };
}
```

As we can see, we already have here some repetition going on, as the types `CoursesEntityModel` and `LessonsEntityModel`
are almost identical. More than that, all the selector code for these two entities would be very similar as well.

Therefore, we do not duplicate such interfaces, but simply use the ready-made `NgxsEntityCollections<Course>`,
`NgxsEntityCollections<Lesson>`.

#### Writing states that support the Entity State format

```ts
@StateRepository()
@State({
    name: 'courses',
    defaults: createEntityCollections()
})
@Injectable()
export class CoursesEntitiesState extends NgxsDataEntityCollectionsRepository<Course> {}
```

```ts
@StateRepository()
@State({
    name: 'lessons',
    defaults: createEntityCollections()
})
@Injectable()
export class LessonEntitiesState extends NgxsDataEntityCollectionsRepository<Lesson> {}
```

```ts
@Component({
    selector: 'app'
    // ..
})
export class AppComponent implements OnInit {
    constructor(private courses: CoursesEntitiesState, private api: ApiCoursesService) {}

    public ngOnInit(): void {
        this.api.getCourses().subscribe((courses: Course[]) => {
            this.courses.setAll(courses);
        });
    }
}
```

See more about [Entity API](./state-repository.md)

#### Primary key

By default, the selection is on the `ID` primary key, you can override this behavior:

```ts
interface Lesson {
    lessonId: number;
    title: string;
}

@StateRepository()
@State({
    name: 'lesson',
    defaults: createEntityCollections()
})
class LessonEntitiesState extends NgxsDataEntityCollectionsRepository<Lesson> {
    public primaryKey: string = 'lessonId';
}
```

or

```ts
@StateRepository()
@State({
    name: 'lesson',
    defaults: createEntityCollections()
})
class LessonEntitiesState extends NgxsDataEntityCollectionsRepository<Lesson> {
    public selectId(entity: Lesson): EntityIdType {
        return entity.lessonId;
    }
}
```

#### Composite key

Composite key, or composite primary key, refers to cases where more than one column is used to specify the primary key
of a table. In such cases, all foreign keys will also need to include all the columns in the composite key. Note that
the columns that make up a composite key can be of different data types.

```ts
interface StudentEntity {
    groupId: number;
    batchId: number;
    name: string;
    course: string;
    dateOfBirth: Date;
}
```

```ts
@StateRepository()
@State({
    name: 'students',
    defaults: createEntityCollections()
})
class StudentEntitiesState extends NgxsDataEntityCollectionsRepository<StudentEntity, string> {
    public selectId(entity: StudentEntity): string {
        return `${entity.groupId}_${entity.batchId}`;
    }
}
```

```ts
@Component({
    /* */
})
export class StudentsComponent implements OnInit {
    constructor(private studentEntities: StudentEntitiesState) {}

    public ngOnInit(): void {
        this.studentEntities.setAll([
            {
                groupId: 1,
                batchId: 1,
                name: 'Maxim',
                course: 'Super A',
                dateOfBirth: new Date(1994, 5, 1)
            },
            {
                groupId: 1,
                batchId: 2,
                name: 'Ivan',
                course: 'Super A',
                dateOfBirth: new Date(1993, 5, 12)
            },
            {
                groupId: 2,
                batchId: 1,
                name: 'Nikola',
                course: 'Super B',
                dateOfBirth: new Date(1997, 7, 11)
            },
            {
                groupId: 2,
                batchId: 2,
                name: 'Petr',
                course: 'Super C',
                dateOfBirth: new Date(1994, 3, 11)
            }
        ]);
    }
}
```

We get the state in store:

```json5
{
    ids: ['1_1', '1_2', '2_1', '2_2'],
    entities: {
        '1_1': {
            groupId: 1,
            batchId: 1,
            name: 'Maxim',
            course: 'Super A',
            dateOfBirth: '1994-05-31T20:00:00.000Z'
        },
        '1_2': {
            groupId: 1,
            batchId: 2,
            name: 'Ivan',
            course: 'Super A',
            dateOfBirth: '1993-06-11T20:00:00.000Z'
        },
        '2_1': {
            groupId: 2,
            batchId: 1,
            name: 'Nikola',
            course: 'Super B',
            dateOfBirth: '1997-08-10T20:00:00.000Z'
        },
        '2_2': {
            groupId: 2,
            batchId: 2,
            name: 'Petr',
            course: 'Super C',
            dateOfBirth: '1994-04-10T20:00:00.000Z'
        }
    }
}
```

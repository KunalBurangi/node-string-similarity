# String Similarity Library

A TypeScript library for comparing strings using various similarity algorithms.

## Features

- **Levenshtein Distance**: Measures the minimum number of edits required to transform one string into another.
- **Jaro-Winkler Distance**: Gives more weight to matching characters at the start of the strings.
- **Cosine Similarity**: Measures similarity based on vector representations of strings.
- **Dice's Coefficient**: Measures overlap between two sets of bigrams.
- **Batch Comparison**: Compare one string against a list of strings.
- **Threshold-Based Matching**: Filter matches based on a similarity threshold.
- **Unicode Support**: Handles multi-byte characters and non-English languages.
- **CLI Tool**: Command-line interface for quick comparisons.
- **RESTful API**: Expose string similarity functionalities as HTTP endpoints.
- **Database Integration**: Utilities for finding similar entries in a database.
- **Visualization**: Highlight differences between two strings.

## Installation

```bash
npm install string-similarity
```

## Usage

### Importing the Library

```typescript
import {
  compareStrings,
  jaroWinklerDistance,
  cosineSimilarity,
  diceCoefficient,
  batchCompareStrings,
  findMatchesAboveThreshold,
} from "string-similarity";
```

### Comparing Strings

```typescript
const similarity = compareStrings("hello", "hell");
console.log(`Similarity: ${similarity}`);
```

### Using Jaro-Winkler Distance

```typescript
const similarity = jaroWinklerDistance("hello", "hell");
console.log(`Jaro-Winkler Similarity: ${similarity}`);
```

### Batch Comparison

```typescript
const results = batchCompareStrings("hello", ["hi", "hey", "hello", "world"]);
console.log(results);
```

### Threshold-Based Matching

```typescript
const matches = findMatchesAboveThreshold("hello", ["hi", "hey", "hello", "world"], 0.8);
console.log(matches);
```

### Visualization

```typescript
import { visualizeStringDifferences } from "string-similarity/visualization";

const visualization = visualizeStringDifferences("hello", "hell");
console.log(visualization);
```

## CLI Tool

### Installation

```bash
npm install -g string-similarity
```

### Usage

```bash
string-similarity compare "hello" "world"
string-similarity jaro-winkler "hello" "hell"
string-similarity cosine "hello" "world"
string-similarity dice "hello" "hell"
```

## RESTful API

### Starting the Server

```bash
node dist/api/server.js
```

### Endpoints

- **POST /compare**
- **POST /jaro-winkler**
- **POST /cosine**
- **POST /dice**

#### Example Request

```json
{
  "str1": "hello",
  "str2": "world"
}
```

#### Example Response

```json
{
  "similarity": 0.4
}
```

## Database Integration

### Finding Similar Entries

```typescript
import { findSimilarEntries } from "string-similarity/dbUtils";

const results = await findSimilarEntries("hello", "my_table", "my_column", 0.8);
console.log(results);
```

### Inserting a String Entry

```typescript
import { insertStringEntry } from "string-similarity/dbUtils";

await insertStringEntry("my_table", "my_column", "hello");
```

## Testing

Run the tests using Jest:

```bash
npm test
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License.
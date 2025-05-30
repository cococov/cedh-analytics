# cEDH Analytics

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A comprehensive web application designed to analyze and visualize the metagame trends in competitive EDH (cEDH). This project aims to provide players, deck builders, and the cEDH community with data-driven insights into card usage, deck archetypes, and metagame shifts over time.

## Index

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Card Analytics**: Track usage statistics for cards across the cEDH metagame
- **Metagame Trends**: Visualize changes in the metagame over time
- **Deck Archetypes**: Identify and analyze popular deck archetypes
- **Ban List Tracking**: Monitor changes to the Commander ban list
- **Tournament Results**: View and analyze tournament data from topdeck.gg

## Technologies

- **Frontend**: Next.js with TypeScript, React, Tailwind CSS
- **UI Components**: NextUI, Material-UI (MUI)
- **Database**: PostgreSQL with Kysely query builder
- **Data Sources**: Scryfall API, MTGJSON, topdeck.gg
- **Monitoring**: Sentry for error tracking and performance monitoring
- **Styling**: Tailwind CSS, CSS Modules
- **CDN**: Cloudflare

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- pnpm package manager
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cococov/cedh-analytics.git
   cd cedh-analytics
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the database:

   ```bash
   # Create the database schema
   psql -U your_username -d your_database -f schema.sql

   # Update the database with initial data
   python scripts/data.py
   python scripts/metagame_v2.py
   ```

4. Configure environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials and API keys
   ```

5. Run the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```text
├── app/                  # Next.js app directory (pages)
├── components/           # React components
│   └── component/        # Component-specific CSS modules
├── public/               # Static assets
│   └── data/             # JSON data files
├── scripts/              # Python scripts for data processing
│   ├── db/               # Database operations
│   └── utils/            # Utility functions
├── styles/               # Global and page-specific styles
├── schema.sql            # Database schema definition
```

## Database

The project uses PostgreSQL for data storage with the following key tables:

- **cards**: Main table for card information (primary key: card_name)
- **ban_list**: Table for banned cards with foreign key constraint to the cards table
- **metagame_cards**: Table for metagame statistics

Database operations in Next.js server-side code use Kysely as the query builder. The database schema is defined in `schema.sql`. All database operations should use transactions, and JSON files in the `public/data` directory should be kept in sync with database tables when applicable.

## Development Guidelines

### Code Style

- Use snake_case for Python variables and functions
- Use camelCase for TypeScript/JavaScript variables and functions
- Include comprehensive docstrings in Python files
- Add type annotations in both Python and TypeScript
- Use Tailwind for simple styling and module CSS for complex styling

### Error Handling and Logging

The project uses Sentry for error tracking and performance monitoring:

- Capture exceptions with `Sentry.captureException(error)`
- Use spans for tracing performance of important operations
- Follow the established patterns for server action instrumentation with `withServerActionInstrumentation`

For Python scripts, use the logging utilities:

- `logs.begin_log_block` and `logs.end_log_block` for operation logging
- `logs.simple_log` for simple logging
- `logs.error_log`, `logs.warning_log`, and `logs.info_log` for different log levels

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please ensure your code follows the project's style guidelines.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

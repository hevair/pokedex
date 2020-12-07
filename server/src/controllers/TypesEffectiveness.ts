import { Request, Response } from 'express';

import { PokemonApiResult, Type } from '../types';
import pokeApi from '../services/pokeApi';

type DemageRelations = {
  multiplier: string;
  type: string;
}[];

export default class TypesEffectiveness {
  public async show(request: Request, response: Response): Promise<Response> {
    const { type } = request.params;

    const { data: typesData } = await pokeApi.get<PokemonApiResult>(`/type`);

    const { data: typeData } = await pokeApi.get<Type>(`/type/${type}`);

    const allTypes = typesData.results;

    const damage_relations: DemageRelations = [];

    typeData.damage_relations.double_damage_from.map(damageType =>
      damage_relations.push({
        multiplier: '2x',
        type: damageType.name,
      }),
    );

    typeData.damage_relations.half_damage_from.map(damageType =>
      damage_relations.push({
        multiplier: '0.5x',
        type: damageType.name,
      }),
    );

    const leftTypes = allTypes.filter(
      ({ name }) =>
        !damage_relations.some(({ type: typeName }) => typeName === name),
    );

    leftTypes.map(leftType =>
      damage_relations.push({
        multiplier: '1x',
        type: leftType.name,
      }),
    );

    return response.json(damage_relations);
  }
}
